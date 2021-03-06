const pattern = [
    /* GREEN */
    { "x" : 2, "y": 16, "side" : 2},
    { "x" : 3, "y": 15, "side" : 2},
    { "x" : 4, "y": 14, "side" : 2},
    { "x" : 5, "y": 13, "side" : 2},
    { "x" : 6, "y": 12, "side" : 2},
    { "x" : 7, "y": 11, "side" : 2},
    { "x" : 8, "y": 10, "side" : 2},
    { "x" : 9, "y": 11, "side" : 2},
    { "x" : 10, "y": 12, "side" : 2},
    { "x" : 11, "y": 13, "side" : 2},
    { "x" : 12, "y": 14, "side" : 2},
    { "x" : 13, "y": 15, "side" : 2},
    { "x" : 14, "y": 16, "side" : 2},
    { "x" : 15, "y": 15, "side" : 2},

    /* YELLOW */
    { "x" : 16, "y": 14, "side" : 1},
    { "x" : 15, "y": 13, "side" : 1},
    { "x" : 14, "y": 12, "side" : 1},
    { "x" : 13, "y": 11, "side" : 1},
    { "x" : 12, "y": 10, "side" : 1},
    { "x" : 11, "y": 9, "side" : 1},
    { "x" : 10, "y": 8, "side" : 1},
    { "x" : 11, "y": 7, "side" : 1},
    { "x" : 12, "y": 6, "side" : 1},
    { "x" : 13, "y": 5, "side" : 1},
    { "x" : 14, "y": 4, "side" : 1},
    { "x" : 15, "y": 3, "side" : 1},
    { "x" : 16, "y": 2, "side" : 1},
    { "x" : 15, "y": 1, "side" : 1},
    

    /* RED */
    { "x" : 14, "y": 0, "side" : 0},
    { "x" : 13, "y": 1, "side" : 0},
    { "x" : 12, "y": 2, "side" : 0},
    { "x" : 11, "y": 3, "side" : 0},
    { "x" : 10, "y": 4, "side" : 0},
    { "x" : 9, "y": 5, "side" : 0},
    { "x" : 8, "y": 6, "side" : 0},
    { "x" : 7, "y": 5, "side" : 0},
    { "x" : 6, "y": 4, "side" : 0},
    { "x" : 5, "y": 3, "side" : 0},
    { "x" : 4, "y": 2, "side" : 0},
    { "x" : 3, "y": 1, "side" : 0},
    { "x" : 2, "y": 0, "side" : 0},
    { "x" : 1, "y": 1, "side" : 0},

    /* BLUE */
    { "x" : 0, "y": 2, "side" : 3},
    { "x" : 1, "y": 3, "side" : 3},
    { "x" : 2, "y": 4, "side" : 3},
    { "x" : 3, "y": 5, "side" : 3},
    { "x" : 4, "y": 6, "side" : 3},
    { "x" : 5, "y": 7, "side" : 3},
    { "x" : 6, "y": 8, "side" : 3},
    { "x" : 5, "y": 9, "side" : 3},
    { "x" : 4, "y": 10, "side" : 3},
    { "x" : 3, "y": 11, "side" : 3},
    { "x" : 2, "y": 12, "side" : 3},
    { "x" : 1, "y": 13, "side" : 3},
    { "x" : 0, "y": 14, "side" : 3},
    { "x" : 1, "y": 15, "side" : 3},
    
]


const cardsDefinitions = {
    "QUEEN" : "une dame",
    "KING" : "un roi",
    "JACK" : "un valet",
    "ACE" : "un as",
    "10" : "un dix",
    "9" : "un neuf",
    "8" : "un huit",
    "7" : "un sept",
    "6" : "un six",
    "5" : "un cinq",
    "4" : "un quatre",
    "3" : "un trois",
    "2" : "un deux",

    "SPADES" : "pique",
    "DIAMONDS" : "carreau",
    "CLUBS" : "tr??fle",
    "HEARTS" : "coeur",
}