// Update the Round interface to include maxQuantity
export interface Round {
  number: number
  maxPurchases: Record<string, number>
  prices: Record<string, number>
}

export const roundData: Round[] = [
    {
      number: 1,
      maxPurchases: {
        sosna: 15,
        swierk: 15,
        buk: 15,
        dab: 15,
        woda: 30,
        chleb: 30,
        truskawki: 7,
        jagody: 7,
        wieprzowina: 8,
        ryby: 9,
        kurczaki: 10,
        "05ha": 1,
        "07ha": 0,
        "1ha": 0,
        "14ha": 1,
        narzedzia: 8,
      },
      prices: {
        sosna: 25,
        swierk: 28,
        buk: 32,
        dab: 36,
        woda: 3,
        chleb: 4,
        truskawki: 8,
        jagody: 9,
        wieprzowina: 13,
        ryby: 8,
        kurczaki: 11,
        "05ha": 500,
        "07ha": 750,
        "1ha": 1200,
        "14ha": 1650,
        narzedzia: 50,
      },
    },
    {
      number: 2,
      maxPurchases: {
        sosna: 15,
        swierk: 15,
        buk: 15,
        dab: 15,
        woda: 5,
        chleb: 20,
        truskawki: 4,
        jagody: 4,
        wieprzowina: 1,
        ryby: 9,
        kurczaki: 10,
        "05ha": 0,
        "07ha": 1,
        "1ha": 0,
        "14ha": 0,
        narzedzia: 8,
      },
      prices: {
        sosna: 25,
        swierk: 28,
        buk: 32,
        dab: 36,
        woda: 8,
        chleb: 7,
        truskawki: 13,
        jagody: 15,
        wieprzowina: 100,
        ryby: 8,
        kurczaki: 11,
        "05ha": 500,
        "07ha": 750,
        "1ha": 1200,
        "14ha": 1650,
        narzedzia: 50,
      },
    },
    {
      number: 3,
      maxPurchases: {
        sosna: 12,
        swierk: 12,
        buk: 3,
        dab: 3,
        woda: 15,
        chleb: 10,
        truskawki: 3,
        jagody: 3,
        wieprzowina: 6,
        ryby: 9,
        kurczaki: 10,
        "05ha": 0,
        "07ha": 0,
        "1ha": 0,
        "14ha": 0,
        narzedzia: 8,
      },
      prices: {
        sosna: 35,
        swierk: 40,
        buk: 90,
        dab: 100,
        woda: 6,
        chleb: 10,
        truskawki: 15,
        jagody: 18,
        wieprzowina: 17,
        ryby: 8,
        kurczaki: 11,
        "05ha": 1000,
        "07ha": 1500,
        "1ha": 2400,
        "14ha": 3300,
        narzedzia: 50,
      },
    },
    {
      number: 4,
      maxPurchases: {
        sosna: 5,
        swierk: 5,
        buk: 5,
        dab: 5,
        woda: 30,
        chleb: 80,
        truskawki: 20,
        jagody: 20,
        wieprzowina: 25,
        ryby: 9,
        kurczaki: 0,
        "05ha": 1,
        "07ha": 1,
        "1ha": 1,
        "14ha": 4,
        narzedzia: 0,
      },
      prices: {
        sosna: 55,
        swierk: 60,
        buk: 75,
        dab: 90,
        woda: 3,
        chleb: 2,
        truskawki: 4,
        jagody: 5,
        wieprzowina: 7,
        ryby: 8,
        kurczaki: 111,
        "05ha": 600,
        "07ha": 900,
        "1ha": 1400,
        "14ha": 1500,
        narzedzia: 500,
      },
    },
    {
      number: 5,
      maxPurchases: {
        sosna: 35,
        swierk: 35,
        buk: 35,
        dab: 35,
        woda: 30,
        chleb: 30,
        truskawki: 0,
        jagody: 7,
        wieprzowina: 8,
        ryby: 0,
        kurczaki: 4,
        "05ha": 3,
        "07ha": 3,
        "1ha": 1,
        "14ha": 0,
        narzedzia: 4,
      },
      prices: {
        sosna: 15,
        swierk: 17,
        buk: 22,
        dab: 25,
        woda: 3,
        chleb: 4,
        truskawki: 25,
        jagody: 9,
        wieprzowina: 13,
        ryby: 88,
        kurczaki: 66,
        "05ha": 300,
        "07ha": 500,
        "1ha": 1400,
        "14ha": 2200,
        narzedzia: 250,
      },
    },
    {
      number: 6,
      maxPurchases: {
        sosna: 0,
        swierk: 10,
        buk: 10,
        dab: 10,
        woda: 30,
        chleb: 30,
        truskawki: 7,
        jagody: 7,
        wieprzowina: 8,
        ryby: 0,
        kurczaki: 40,
        "05ha": 0,
        "07ha": 0,
        "1ha": 0,
        "14ha": 0,
        narzedzia: 20,
      },
      prices: {
        sosna: 75,
        swierk: 45,
        buk: 55,
        dab: 65,
        woda: 3,
        chleb: 4,
        truskawki: 8,
        jagody: 9,
        wieprzowina: 13,
        ryby: 88,
        kurczaki: 4,
        "05ha": 600,
        "07ha": 1000,
        "1ha": 2800,
        "14ha": 4400,
        narzedzia: 20,
      },
    },
    {
      number: 7,
      maxPurchases: {
        sosna: 15,
        swierk: 0,
        buk: 15,
        dab: 15,
        woda: 100,
        chleb: 30,
        truskawki: 7,
        jagody: 7,
        wieprzowina: 8,
        ryby: 9,
        kurczaki: 10,
        "05ha": 2,
        "07ha": 1,
        "1ha": 0,
        "14ha": 1,
        narzedzia: 8,
      },
      prices: {
        sosna: 25,
        swierk: 85,
        buk: 32,
        dab: 36,
        woda: 1,
        chleb: 4,
        truskawki: 8,
        jagody: 9,
        wieprzowina: 13,
        ryby: 8,
        kurczaki: 11,
        "05ha": 500,
        "07ha": 800,
        "1ha": 2500,
        "14ha": 3700,
        narzedzia: 50,
      },
    },
  ]