import inquirer from 'inquirer';
import chalk from 'chalk';

const generatedUserId: number = Math.floor((Math.random() * 10) + 1);
const generatedPINCode: number = Math.floor((Math.random() * 1000) + 1000);
let bankBalance: number = Math.floor(Math.random() * 100000);

interface userData {
    userID: number,
    userPIN: number
}


const userId: userData = await inquirer.prompt([
    {
        type:"number",
        name: "userID",
        message: "Please enter your user ID"
    },
    {
        type:"password",
        name: "userPIN",
        message: "Please enter your PIN code"
    },
]
)

const { userID, userPIN } = userId;


const handleWithdrawingCash = async () => {
    const withdrawalAmount: {
        amount: number
    } = await inquirer.prompt(
        {
            type:"number",
            name:"amount",
            message: "Please enter your withdrawal amount"
        }
    ) 

    const { amount } = withdrawalAmount;
    if(amount <= bankBalance) {
        bankBalance - amount;
        console.log(chalk.green(`Please collect your amount: Rs. ${amount}`))
    } else {
        console.log(chalk.red("Error: Balance is insufficient"));
    }
}

const handleDepositingMoney = (amount: number | undefined) => {
    if(amount) {
        console.log(chalk.green(`Your amount Rs.${amount}  is deposited successfully`))
        bankBalance += amount;
    } else {
        console.log(chalk.red("Error: Enter amount is incorrect"));
    }
}

const handleTransferringFunds = (IBAN: number,transferAmount:number) => {
    if(IBAN) {
        if(transferAmount) {
            console.log(chalk.green(`Your amount Rs.${transferAmount} is transfer successfully`));
        } else {
            console.log(chalk.red("Transfer amount is incorrect or empty"));
        }
    } else {
        console.log(chalk.red("IBAN number is incorrect or empty"));
    } 
}

const handleBalanceInquiries = () => {
    console.log(chalk.green(`Your account balance is ${bankBalance}`))
}

type service = {
    selectedService: string,
    depositType: string,
    chequeAmount: number,
    cashAmount: number,
    IBAN: number,
    transferAmount: number,
    fundTransferType: string,

}


if(generatedUserId === userID && generatedPINCode === Number(userPIN)) {
    const selectService: service = await inquirer.prompt(
        [

            {
                type:"list",
                name:"selectedService",
                message:"Please select a service",
                choices:["Withdrawing cash","Depositing money","Transferring funds", "Balance inquiries"],
            },
            {
                type:"list",
                name:"fundTransferType",
                message:"Please select a type of transfer",
                choices:["Amount at Other Bank","Account at UBL"],
                when(answers) {
                    return answers.selectedService === "Transferring funds"
                }
            },
            {
                type:"number",
                name:"IBAN",
                message:"Please enter account IBAN number",
                when(answers) {
                    return answers.fundTransferType
                }
            },
            {
                type:"number",
                name:"transferAmount",
                message: "Please enter amount of transfer",
                when(answers) {
                    return answers.IBAN
                }
            },
            {
                type:"list",
                name:"depositType",
                message:"Please select deposit type",
                choices:["Cheque","Cash"],
                when(answers) {
                    return answers.selectedService === "Depositing money"
                }
            },
            {
                type: "number",
                name:"chequeAmount",
                message:"Please enter cheque amount",
                when(answers) {
                    return answers.depositType === "Cheque"
                }  
            },
            {
                type: "number",
                name:"cashAmount",
                message:"Please enter cash amount",
                when(answers) {
                    return answers.depositType === "Cash"
                }  
            }
        ]
    )
        const { selectedService,chequeAmount, cashAmount,IBAN,transferAmount } = selectService;
    if(selectedService) {
        switch(selectedService) {
            case "Withdrawing cash":
                handleWithdrawingCash();
                break;
            case "Depositing money":
                handleDepositingMoney(chequeAmount || cashAmount);
                break;
            case "Transferring funds":
                handleTransferringFunds(IBAN,transferAmount);
                break;
            case "Balance inquiries":
                handleBalanceInquiries();
                break;

        }
    } else {
        console.log(chalk.red("Error: Invalid selection"));
    }
} else {
    console.log(chalk.red("Error: Invalid user ID or PIN code"));
}


