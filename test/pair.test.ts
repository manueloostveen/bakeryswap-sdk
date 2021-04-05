import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe.only('Pair', () => {
  const WBNB = new Token(ChainId.MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')
  const BAKE = new Token(ChainId.MAINNET, '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', 18, 'BAKE', 'Bakery Token')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(WETH[ChainId.BSCTESTNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe.only('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(WBNB, BAKE)).toEqual('0xc2Eed0F5a0dc28cfa895084bC0a9B8B8279aE492')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).token0).toEqual(BAKE)
      expect(new Pair(new TokenAmount(BAKE, '100'), new TokenAmount(WBNB, '100')).token0).toEqual(BAKE)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).token1).toEqual(WBNB)
      expect(new Pair(new TokenAmount(BAKE, '100'), new TokenAmount(WBNB, '100')).token1).toEqual(WBNB)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '101')).reserve0).toEqual(
        new TokenAmount(BAKE, '101')
      )
      expect(new Pair(new TokenAmount(BAKE, '101'), new TokenAmount(WBNB, '100')).reserve0).toEqual(
        new TokenAmount(BAKE, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '101')).reserve1).toEqual(
        new TokenAmount(WBNB, '100')
      )
      expect(new Pair(new TokenAmount(BAKE, '101'), new TokenAmount(WBNB, '100')).reserve1).toEqual(
        new TokenAmount(WBNB, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(WBNB, '101'), new TokenAmount(BAKE, '100')).token0Price).toEqual(
        new Price(BAKE, WBNB, '100', '101')
      )
      expect(new Pair(new TokenAmount(BAKE, '100'), new TokenAmount(WBNB, '101')).token0Price).toEqual(
        new Price(BAKE, WBNB, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(WBNB, '101'), new TokenAmount(BAKE, '100')).token1Price).toEqual(
        new Price(WBNB, BAKE, '101', '100')
      )
      expect(new Pair(new TokenAmount(BAKE, '100'), new TokenAmount(WBNB, '101')).token1Price).toEqual(
        new Price(WBNB, BAKE, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(WBNB, '101'), new TokenAmount(BAKE, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(BAKE)).toEqual(pair.token0Price)
      expect(pair.priceOf(WBNB)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '101')).reserveOf(WBNB)).toEqual(
        new TokenAmount(WBNB, '100')
      )
      expect(new Pair(new TokenAmount(BAKE, '101'), new TokenAmount(WBNB, '100')).reserveOf(WBNB)).toEqual(
        new TokenAmount(WBNB, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(BAKE, '101'), new TokenAmount(WBNB, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(BAKE, '100'), new TokenAmount(WBNB, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).involvesToken(WBNB)).toEqual(true)
    expect(new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).involvesToken(BAKE)).toEqual(true)
    expect(
      new Pair(new TokenAmount(WBNB, '100'), new TokenAmount(BAKE, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
