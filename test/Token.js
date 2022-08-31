const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token', () => {
    let token

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy()
    })

    it('has correct name', async () => {
        expect(await token.name()).to.equal('Jan Token')
    })

    it('has correct symbol', async () => {
        expect(await token.symbol()).to.equal('JAN')
    })
})

