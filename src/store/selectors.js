import { createSelector } from 'reselect'
import { get, groupBy } from 'lodash'
import moment from 'moment'
import { ethers } from 'ethers'

const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])

const GREEN = '#25CE8F'
const RED = '#F45353'


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
    tokenPrice,
    fromatedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D')
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
    orders = decorateOrderBookOrders(orders, tokens)

    // Group orders by "orderType"
    orders = groupBy(orders, 'orderType')

    // Fetch buy orders
    const buyOrders = get(orders, 'buy', [])

    // Sort buy orders by token price
    orders = {
      ...orders,
      buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    // Fetch sell orders
    const sellOrders = get(orders, 'sell', [])
    
    // Sort sell orders by token price
    orders = {
      ...orders,
      sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    return orders
  }
)

const decorateOrderBookOrders = (orders, tokens) => {
  return(
    orders.map(order => {
      order = decorateOrder(order, tokens)
      order = decorateOrderBookOrder(order, tokens)
      return order
    })
  )
}

const decorateOrderBookOrder = (order, tokens) => {
  const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'

  return({
    ...order,
    orderType,
    orderTypeClass: (orderType === 'buy' ? GREEN : RED),
    orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
  })
}
