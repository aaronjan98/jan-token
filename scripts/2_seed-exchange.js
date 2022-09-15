const config = require('../src/config.json');
const { tokens, wait } = require('../common/tokens.js');

async function main() {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await ethers.getSigners()

    // Fetch network
    const { chainId } = await ethers.provider.getNetwork()
    console.log("Using chainId:", chainId)

    // Fetch deployed tokens
    const Jan = await ethers.getContractAt('Token', config[chainId].Jan.address)
    console.log(`Jan Token fetched: ${Jan.address}\n`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}\n`)

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
    console.log(`mDAI Token fetched: ${mDAI.address}\n`)

    // Fetch the deployed exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
    console.log(`Exchange fetched: ${exchange.address}\n`)

    // Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 transfers 10,000 mETH
    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    // user1 approves 10,000 Jan
    transaction = await Jan.connect(user1).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approve ${amount} tokens from ${user1.address}\n`)

    // user1 deposits 10,000 Jan
    transaction = await exchange.connect(user1).depositToken(Jan.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

    // user2 Approves mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}\n`)

    // user2 deposits 10,000 mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}\n`)

    /*
     *  Seed a Cancelled Order
     */

    // User 1 makes order to get tokens
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Jan.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User 1 cancels order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Cancelled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    /*
     *  Seed filled Orders
     */

    // User 1 makes order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Jan.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User 2 fills order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)
    
    // Wait 1 second
    await wait(1)

    // User 1 makes another order
    transaction = await exchange.makeOrder(mETH.address, tokens(50), Jan.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User 2 fills another order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    // User 1 makes final order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), Jan.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User 2 fills final order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    /*
     *  Seed Open Orders
     */

    // User 1 makes 10 orders
    for(let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), Jan.address, tokens(10))
        result = await transaction.wait()

        console.log(`Made order from ${user1.address}`)

        await wait(1)
    }

    // User 2 makes 10 orders
    for(let i =1; i <= 10; i++) {
        transaction = await exchange.connect(user2).makeOrder(Jan.address, tokens(10), mETH.address, tokens(10 *i))
        result = await transaction.wait()

        console.log(`Made order from ${user2.address}`)

        await wait(1)
    }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
