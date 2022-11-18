import { createSelector } from 'reselect'
import { get } from 'lodash'
import { ethers } from 'ethers'

const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])

const decorateOrder = (order, tokens) => {
  let token0Amount, token1Amount

  if (order.tokenGive === tokens[1].address) {
    token0Amount = order.amountGive
    token1Amount = order.amountGet
  } else {
    token0Amount = order.amountGet
    token1Amount = order.amountGive
  }

  const precision = 100000
  let tokenPrice = (token1Amount / token0Amount)
  tokenPrice = Math.round(tokenPrice * precision) / precision

  return({
    ...order,
    token0Amount: ethers.utils.formatEther(token0Amount, 'ethers'),
    token1Amount: ethers.utils.formatEther(token1Amount, 'ethers'),
    tokenPrice
  })
}

/*
 * ORDER BOOK
 */

export const orderBookSelector = createSelector(
  allOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) {
      return
    }

    // Filter orders by selected tokens
    orders = orders.filter(
      o => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address
    )
    orders = orders.filter(
      o =>
        o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address
    )

    // Decorate orders
    orders.map(order => {
      let o = decorateOrder(order, tokens)
      console.log(o)
    })
  }
)
