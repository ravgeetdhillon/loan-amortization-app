# I want to create something to list a car loan mortization chart.

## here are the important requirements to consider

- the rate of interest is floating and can change anytime. it should have an option to update the interest rate.
- The emi remains constant throughout the loan repayment period. so take these in mind while doing the calculations.
- inputs from user should be principal amount, tenure in months, rate of interest
- you should calculate the EMI and present an amortization schedule
- default currency is INR and also format the currency with proper commas and 2 place decimals
- set these defaults:
  - principal = 1200000
  - rate of interest = 8.8
  - tenure(months) = 84
- add a loan tenure start date, default value for it is 22 August 2024
- allow user to select a date till which he has paid the EMIs and show stats like interest paid, interest left, principal paid and principal left

## For development/coding:

- setup a watcher so that when code changes, changes are reflected instantly
