class LoanAmortizationCalculator {
  constructor() {
    this.loanData = {
      principal: 0,
      tenure: 0,
      initialRate: 0,
      startDate: null,
      paidTillDate: null,
      emi: 0,
      rateChanges: [], // Array of {paymentNumber, rate}
      schedule: [],
    };

    this.currentPage = 1;
    this.rowsPerPage = 50;

    this.initializeEventListeners();
    this.autoCalculateWithDefaults();
  }

  // Utility function for consistent INR currency formatting
  formatINR(amount) {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Auto-calculate with default values on page load
  autoCalculateWithDefaults() {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (
        document.getElementById("principal").value &&
        document.getElementById("tenure").value &&
        document.getElementById("initialRate").value &&
        document.getElementById("startDate").value
      ) {
        this.calculateInitialSchedule();
      }
    }, 100);
  }

  initializeEventListeners() {
    // Loan form submission
    document.getElementById("loanForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.calculateInitialSchedule();
    });

    // Interest rate update form
    document
      .getElementById("updateRateForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.updateInterestRate();
      });

    // Export functionality
    document.getElementById("exportBtn").addEventListener("click", () => {
      this.exportToCSV();
    });

    // Search functionality
    document.getElementById("searchPayment").addEventListener("input", (e) => {
      this.searchPayment(e.target.value);
    });

    // Paid till date change
    document.getElementById("paidTillDate").addEventListener("change", () => {
      this.updatePaymentProgress();
    });

    // Pagination
    document.getElementById("prevPage").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      const totalPages = Math.ceil(
        this.loanData.schedule.length / this.rowsPerPage
      );
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderTable();
      }
    });
  }

  calculateInitialSchedule() {
    // Get form values
    this.loanData.principal = parseFloat(
      document.getElementById("principal").value
    );
    this.loanData.tenure = parseInt(document.getElementById("tenure").value);
    this.loanData.initialRate = parseFloat(
      document.getElementById("initialRate").value
    );
    this.loanData.startDate = new Date(
      document.getElementById("startDate").value
    );

    // Reset rate changes
    this.loanData.rateChanges = [];

    // Validate inputs
    if (
      this.loanData.principal <= 0 ||
      this.loanData.tenure <= 0 ||
      this.loanData.initialRate < 0 ||
      !this.loanData.startDate ||
      isNaN(this.loanData.startDate.getTime())
    ) {
      alert("Please enter valid loan details including a valid start date");
      return;
    }

    // Calculate EMI using the standard formula
    this.loanData.emi = this.calculateEMI(
      this.loanData.principal,
      this.loanData.initialRate,
      this.loanData.tenure
    );

    // Display calculated EMI
    document.getElementById("calculatedEMI").textContent = this.formatINR(
      this.loanData.emi
    );
    document.getElementById("emiDisplay").style.display = "block";

    // Calculate schedule
    this.generateAmortizationSchedule();

    // Show sections
    document.getElementById("updateRateSection").style.display = "block";
    document.getElementById("summarySection").style.display = "block";
    document.getElementById("progressSection").style.display = "block";
    document.getElementById("tableSection").style.display = "block";

    // Update UI
    this.updateSummary();
    this.updatePaymentProgress();
    this.renderTable();
    this.updateRateChangesList();
  }

  calculateEMI(principal, annualRate, tenureMonths) {
    // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
    // where P = Principal, R = Monthly interest rate, N = Number of months

    if (annualRate === 0) {
      // If interest rate is 0, EMI is simply principal divided by tenure
      return principal / tenureMonths;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numerator =
      principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
    const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;

    return numerator / denominator;
  }

  generateAmortizationSchedule() {
    this.loanData.schedule = [];

    let balance = this.loanData.principal;
    let paymentNumber = 1;
    let currentDate = new Date(this.loanData.startDate);
    let currentRate = this.loanData.initialRate;

    // Sort rate changes by payment number
    const sortedRateChanges = [...this.loanData.rateChanges].sort(
      (a, b) => a.paymentNumber - b.paymentNumber
    );
    let rateChangeIndex = 0;

    // Use the original tenure as maximum, but allow for early completion
    const maxPayments = this.loanData.tenure;

    while (balance > 0.01 && paymentNumber <= maxPayments) {
      // Check if there's a rate change for this payment
      if (
        rateChangeIndex < sortedRateChanges.length &&
        sortedRateChanges[rateChangeIndex].paymentNumber === paymentNumber
      ) {
        currentRate = sortedRateChanges[rateChangeIndex].rate;
        rateChangeIndex++;

        // EMI remains constant - only the interest/principal split changes
        // No recalculation of EMI needed as per requirement
      }

      // Calculate monthly interest rate
      const monthlyRate = currentRate / 100 / 12;

      // Calculate interest for this payment
      const interestPayment = balance * monthlyRate;

      // Calculate principal payment
      let principalPayment = this.loanData.emi - interestPayment;

      // Adjust for final payment
      if (principalPayment > balance) {
        principalPayment = balance;
        const actualEMI = interestPayment + principalPayment;

        this.loanData.schedule.push({
          paymentNumber,
          date: new Date(currentDate),
          rate: currentRate,
          emi: actualEMI,
          interest: interestPayment,
          principal: principalPayment,
          balance: 0,
          isRateChange:
            rateChangeIndex > 0 &&
            sortedRateChanges[rateChangeIndex - 1].paymentNumber ===
              paymentNumber,
        });
        break;
      }

      // Update balance
      balance -= principalPayment;

      // Add to schedule
      this.loanData.schedule.push({
        paymentNumber,
        date: new Date(currentDate),
        rate: currentRate,
        emi: this.loanData.emi,
        interest: interestPayment,
        principal: principalPayment,
        balance: balance,
        isRateChange:
          rateChangeIndex > 0 &&
          sortedRateChanges[rateChangeIndex - 1].paymentNumber ===
            paymentNumber,
      });

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      paymentNumber++;
    }
  }

  updateInterestRate() {
    const paymentNumber = parseInt(
      document.getElementById("paymentNumber").value
    );
    const newRate = parseFloat(document.getElementById("newRate").value);

    // Validate inputs
    if (paymentNumber < 1 || paymentNumber > this.loanData.schedule.length) {
      alert(
        `Payment number must be between 1 and ${this.loanData.schedule.length}`
      );
      return;
    }

    if (newRate < 0) {
      alert("Interest rate cannot be negative");
      return;
    }

    // Check if rate change already exists for this payment
    const existingIndex = this.loanData.rateChanges.findIndex(
      (change) => change.paymentNumber === paymentNumber
    );

    if (existingIndex >= 0) {
      // Update existing rate change
      this.loanData.rateChanges[existingIndex].rate = newRate;
    } else {
      // Add new rate change
      this.loanData.rateChanges.push({ paymentNumber, rate: newRate });
    }

    // Recalculate schedule
    this.generateAmortizationSchedule();

    // Update UI
    this.updateSummary();
    this.updatePaymentProgress();
    this.renderTable();
    this.updateRateChangesList();

    // Clear form
    document.getElementById("updateRateForm").reset();
  }

  removeRateChange(paymentNumber) {
    this.loanData.rateChanges = this.loanData.rateChanges.filter(
      (change) => change.paymentNumber !== paymentNumber
    );

    // Recalculate schedule
    this.generateAmortizationSchedule();

    // Update UI
    this.updateSummary();
    this.updatePaymentProgress();
    this.renderTable();
    this.updateRateChangesList();
  }

  updateSummary() {
    const totalInterest = this.loanData.schedule.reduce(
      (sum, payment) => sum + payment.interest,
      0
    );
    const totalAmount = this.loanData.principal + totalInterest;
    const totalPayments = this.loanData.schedule.length;
    const years = Math.floor(totalPayments / 12);
    const months = totalPayments % 12;

    document.getElementById("totalInterest").textContent =
      this.formatINR(totalInterest);
    document.getElementById("totalAmount").textContent =
      this.formatINR(totalAmount);
    document.getElementById("totalPayments").textContent = totalPayments;
    document.getElementById(
      "loanDuration"
    ).textContent = `${years} years ${months} months`;
  }

  updatePaymentProgress() {
    const paidTillDateInput = document.getElementById("paidTillDate").value;

    if (!paidTillDateInput || this.loanData.schedule.length === 0) {
      // Hide progress info if no date selected
      document.getElementById("progressInfo").style.display = "none";
      this.resetProgressStats();
      return;
    }

    const paidTillDate = new Date(paidTillDateInput);
    this.loanData.paidTillDate = paidTillDate;

    // Find the last payment that should be paid by this date
    let lastPaidPayment = 0;
    let interestPaid = 0;
    let principalPaid = 0;

    for (let i = 0; i < this.loanData.schedule.length; i++) {
      const payment = this.loanData.schedule[i];
      if (payment.date <= paidTillDate) {
        lastPaidPayment = payment.paymentNumber;
        interestPaid += payment.interest;
        principalPaid += payment.principal;
      } else {
        break;
      }
    }

    // Calculate remaining amounts
    const totalInterest = this.loanData.schedule.reduce(
      (sum, payment) => sum + payment.interest,
      0
    );
    const interestLeft = totalInterest - interestPaid;
    const principalLeft = this.loanData.principal - principalPaid;
    const emisPaid = lastPaidPayment;
    const emisLeft = this.loanData.schedule.length - emisPaid;

    // Update UI
    document.getElementById("progressDate").textContent =
      paidTillDate.toLocaleDateString();
    document.getElementById("progressInfo").style.display = "block";

    document.getElementById("interestPaid").textContent =
      this.formatINR(interestPaid);
    document.getElementById("interestLeft").textContent =
      this.formatINR(interestLeft);
    document.getElementById("principalPaid").textContent =
      this.formatINR(principalPaid);
    document.getElementById("principalLeft").textContent =
      this.formatINR(principalLeft);
    document.getElementById("emisPaid").textContent = emisPaid;
    document.getElementById("emisLeft").textContent = emisLeft;

    // Update table to show paid vs unpaid rows
    this.renderTable();
  }

  resetProgressStats() {
    document.getElementById("interestPaid").textContent = "₹0.00";
    document.getElementById("interestLeft").textContent = "₹0.00";
    document.getElementById("principalPaid").textContent = "₹0.00";
    document.getElementById("principalLeft").textContent = "₹0.00";
    document.getElementById("emisPaid").textContent = "0";
    document.getElementById("emisLeft").textContent = "0";
  }

  updateRateChangesList() {
    const container = document.getElementById("rateChangesList");

    if (this.loanData.rateChanges.length === 0) {
      container.innerHTML =
        '<p class="text-secondary">No rate changes applied</p>';
      return;
    }

    const sortedChanges = [...this.loanData.rateChanges].sort(
      (a, b) => a.paymentNumber - b.paymentNumber
    );

    container.innerHTML = sortedChanges
      .map(
        (change) => `
            <div class="rate-change-item">
                <span class="change-info">
                    Payment #${change.paymentNumber}: ${change.rate.toFixed(
          2
        )}% p.a.
                </span>
                <button class="remove-btn" onclick="calculator.removeRateChange(${
                  change.paymentNumber
                })">
                    Remove
                </button>
            </div>
        `
      )
      .join("");
  }

  renderTable() {
    const tbody = document.getElementById("tableBody");
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = Math.min(
      startIndex + this.rowsPerPage,
      this.loanData.schedule.length
    );
    const totalPages = Math.ceil(
      this.loanData.schedule.length / this.rowsPerPage
    );

    // Clear existing rows
    tbody.innerHTML = "";

    // Render rows for current page
    for (let i = startIndex; i < endIndex; i++) {
      const payment = this.loanData.schedule[i];
      const row = tbody.insertRow();

      // Add styling classes
      if (payment.isRateChange) {
        row.classList.add("rate-change-row");
      }

      // Check if this payment is paid based on paidTillDate
      if (
        this.loanData.paidTillDate &&
        payment.date <= this.loanData.paidTillDate
      ) {
        row.classList.add("paid-row");
      }

      row.innerHTML = `
                <td class="font-bold">${payment.paymentNumber}</td>
                <td>${payment.date.toLocaleDateString()}</td>
                <td class="text-right ${
                  payment.isRateChange ? "text-success font-bold" : ""
                }">${payment.rate.toFixed(2)}%</td>
                <td class="text-right">${this.formatINR(payment.emi)}</td>
                <td class="text-right">${this.formatINR(payment.interest)}</td>
                <td class="text-right">${this.formatINR(payment.principal)}</td>
                <td class="text-right font-bold">${this.formatINR(
                  payment.balance
                )}</td>
            `;
    }

    // Update pagination info
    document.getElementById(
      "pageInfo"
    ).textContent = `Page ${this.currentPage} of ${totalPages}`;
    document.getElementById("prevPage").disabled = this.currentPage === 1;
    document.getElementById("nextPage").disabled =
      this.currentPage === totalPages;
  }

  searchPayment(paymentNumber) {
    if (!paymentNumber) {
      this.currentPage = 1;
      this.renderTable();
      return;
    }

    const payment = parseInt(paymentNumber);
    if (
      isNaN(payment) ||
      payment < 1 ||
      payment > this.loanData.schedule.length
    ) {
      return;
    }

    // Calculate which page contains this payment
    this.currentPage = Math.ceil(payment / this.rowsPerPage);
    this.renderTable();

    // Highlight the row
    setTimeout(() => {
      const tbody = document.getElementById("tableBody");
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const rowIndex = payment - startIndex - 1;

      if (rowIndex >= 0 && rowIndex < tbody.rows.length) {
        // Remove existing highlights
        tbody.querySelectorAll(".highlight").forEach((row) => {
          row.classList.remove("highlight");
        });

        // Add highlight to found row
        tbody.rows[rowIndex].classList.add("highlight");
        tbody.rows[rowIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }

  exportToCSV() {
    if (this.loanData.schedule.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Payment Number",
      "Date",
      "Interest Rate (%)",
      "EMI (₹)",
      "Interest (₹)",
      "Principal (₹)",
      "Balance (₹)",
    ];

    const csvContent = [
      headers.join(","),
      ...this.loanData.schedule.map((payment) =>
        [
          payment.paymentNumber,
          payment.date.toLocaleDateString(),
          payment.rate.toFixed(2),
          payment.emi.toFixed(2),
          payment.interest.toFixed(2),
          payment.principal.toFixed(2),
          payment.balance.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `loan_amortization_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// Initialize the calculator when the page loads
let calculator;
document.addEventListener("DOMContentLoaded", () => {
  calculator = new LoanAmortizationCalculator();
});
