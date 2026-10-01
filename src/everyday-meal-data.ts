import type { EverydayMeal, MealAddOn } from './everyday-meal-types'

// Locked GoodFood V1 estimates and curated tags; see docs/everyday-meals-42a.md.
export const everydayMeals: EverydayMeal[] = [
  {
    "id": "pork-suki",
    "image": "/everyday-meals/pork-suki.webp",
    "nameTh": "สุกี้หมู",
    "nameEn": "Pork Suki",
    "category": "suki",
    "tags": [
      "high-protein",
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 220,
        "max": 450
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "preparation",
        "labelTh": "รูปแบบ",
        "choices": [
          {
            "id": "soup",
            "labelTh": "น้ำ",
            "nutrition": {
              "kcal": {
                "min": 220,
                "max": 350
              }
            },
            "tags": [
              "light"
            ]
          },
          {
            "id": "dry",
            "labelTh": "แห้ง",
            "nutrition": {
              "kcal": {
                "min": 350,
                "max": 450
              }
            }
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "น้ำจิ้มแยกหรือลดน้ำจิ้มได้ หากอยากควบคุมความหวานและความเค็ม",
        "type": "general"
      }
    ]
  },
  {
    "id": "chicken-suki",
    "image": "/everyday-meals/chicken-suki.webp",
    "nameTh": "สุกี้ไก่",
    "nameEn": "Chicken Suki",
    "category": "suki",
    "tags": [
      "high-protein",
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 200,
        "max": 430
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "preparation",
        "labelTh": "รูปแบบ",
        "choices": [
          {
            "id": "soup",
            "labelTh": "น้ำ",
            "nutrition": {
              "kcal": {
                "min": 200,
                "max": 330
              }
            },
            "tags": [
              "light"
            ]
          },
          {
            "id": "dry",
            "labelTh": "แห้ง",
            "nutrition": {
              "kcal": {
                "min": 330,
                "max": 430
              }
            }
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "น้ำจิ้มแยกหรือลดน้ำจิ้มได้ หากอยากควบคุมความหวานและความเค็ม",
        "type": "general"
      }
    ]
  },
  {
    "id": "seafood-suki",
    "image": "/everyday-meals/seafood-suki.webp",
    "nameTh": "สุกี้ทะเล",
    "nameEn": "Seafood Suki",
    "category": "suki",
    "tags": [
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 200,
        "max": 400
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "preparation",
        "labelTh": "รูปแบบ",
        "choices": [
          {
            "id": "soup",
            "labelTh": "น้ำ",
            "nutrition": {
              "kcal": {
                "min": 200,
                "max": 330
              }
            },
            "tags": [
              "light"
            ]
          },
          {
            "id": "dry",
            "labelTh": "แห้ง",
            "nutrition": {
              "kcal": {
                "min": 300,
                "max": 400
              }
            }
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "น้ำจิ้มแยกหรือลดน้ำจิ้มได้ หากอยากควบคุมความหวานและความเค็ม",
        "type": "general"
      }
    ]
  },
  {
    "id": "pork-rice-soup",
    "image": "/everyday-meals/pork-rice-soup.webp",
    "nameTh": "ข้าวต้มหมู",
    "nameEn": "Pork Rice Soup",
    "category": "porridge",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 250,
        "max": 350
      },
      "proteinG": {
        "min": 12,
        "max": 20
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "boiled-egg"
    ],
    "orderingTips": [
      {
        "textTh": "เพิ่มเนื้อสัตว์ได้หากอยากเพิ่มโปรตีน",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "fish-rice-soup",
    "image": "/everyday-meals/fish-rice-soup.webp",
    "nameTh": "ข้าวต้มปลา",
    "nameEn": "Fish Rice Soup",
    "category": "porridge",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 220,
        "max": 350
      },
      "proteinG": {
        "min": 14,
        "max": 22
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "เพิ่มเนื้อสัตว์ได้หากอยากเพิ่มโปรตีน",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "shrimp-rice-soup",
    "image": "/everyday-meals/shrimp-rice-soup.webp",
    "nameTh": "ข้าวต้มกุ้ง",
    "nameEn": "Shrimp Rice Soup",
    "category": "porridge",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 230,
        "max": 350
      },
      "proteinG": {
        "min": 12,
        "max": 20
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "เพิ่มเนื้อสัตว์ได้หากอยากเพิ่มโปรตีน",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "pork-congee",
    "image": "/everyday-meals/pork-congee.webp",
    "nameTh": "โจ๊กหมู",
    "nameEn": "Pork Congee",
    "category": "porridge",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 500
      },
      "proteinG": {
        "min": 17,
        "max": 24
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "boiled-egg"
    ],
    "orderingTips": [
      {
        "textTh": "เพิ่มเนื้อสัตว์ได้หากอยากเพิ่มโปรตีน",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "pork-blood-soup-with-rice",
    "image": "/everyday-meals/pork-blood-soup-with-rice.webp",
    "nameTh": "ต้มเลือดหมู + ข้าว",
    "nameEn": "Pork Blood Soup with Rice",
    "category": "soup",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 450
      },
      "proteinG": {
        "min": 25,
        "max": 35
      },
      "servingAssumption": "1 ชุด ขนาดมื้อทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ปรับปริมาณข้าวได้ตามความหิว",
        "type": "general"
      }
    ]
  },
  {
    "id": "pork-clear-soup-with-rice",
    "image": "/everyday-meals/pork-clear-soup-with-rice.webp",
    "nameTh": "เกาเหลาหมู + ข้าว",
    "nameEn": "Pork Clear Soup with Rice",
    "category": "soup",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 250,
        "max": 400
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 ชุด ขนาดมื้อทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ปรับปริมาณข้าวได้ตามความหิว",
        "type": "general"
      }
    ]
  },
  {
    "id": "beef-clear-soup-with-rice",
    "image": "/everyday-meals/beef-clear-soup-with-rice.webp",
    "nameTh": "เกาเหลาเนื้อ + ข้าว",
    "nameEn": "Beef Clear Soup with Rice",
    "category": "soup",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 250,
        "max": 400
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 ชุด ขนาดมื้อทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ปรับปริมาณข้าวได้ตามความหิว",
        "type": "general"
      }
    ]
  },
  {
    "id": "pork-clear-noodle-soup",
    "image": "/everyday-meals/pork-clear-noodle-soup.webp",
    "nameTh": "ก๋วยเตี๋ยวหมูน้ำใส",
    "nameEn": "Pork Clear Noodle Soup",
    "category": "noodle",
    "tags": [
      "light"
    ],
    "nutrition": {
      "kcal": {
        "min": 280,
        "max": 400
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ถ้าอยากเพิ่มโปรตีน เลือกเพิ่มเนื้อสัตว์แทนการเพิ่มเส้น",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "pork-tom-yum-noodles",
    "image": "/everyday-meals/pork-tom-yum-noodles.webp",
    "nameTh": "ก๋วยเตี๋ยวหมูต้มยำ",
    "nameEn": "Pork Tom Yum Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 320,
        "max": 450
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ชิมก่อนปรุง เพราะน้ำซุปมีเครื่องปรุงอยู่แล้ว",
        "type": "general"
      }
    ]
  },
  {
    "id": "pork-boat-noodles",
    "image": "/everyday-meals/pork-boat-noodles.webp",
    "nameTh": "ก๋วยเตี๋ยวเรือหมู",
    "nameEn": "Pork Boat Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 450
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ชิมก่อนปรุง เพราะน้ำซุปมีเครื่องปรุงอยู่แล้ว",
        "type": "general"
      }
    ]
  },
  {
    "id": "beef-boat-noodles",
    "image": "/everyday-meals/beef-boat-noodles.webp",
    "nameTh": "ก๋วยเตี๋ยวเรือเนื้อ",
    "nameEn": "Beef Boat Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 450
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ชิมก่อนปรุง เพราะน้ำซุปมีเครื่องปรุงอยู่แล้ว",
        "type": "general"
      }
    ]
  },
  {
    "id": "chicken-bitter-melon-noodles",
    "image": "/everyday-meals/chicken-bitter-melon-noodles.webp",
    "nameTh": "ก๋วยเตี๋ยวไก่มะระ",
    "nameEn": "Chicken and Bitter Melon Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 450
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ถ้าอยากเพิ่มโปรตีน เลือกเพิ่มเนื้อสัตว์แทนการเพิ่มเส้น",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "yen-ta-fo",
    "image": "/everyday-meals/yen-ta-fo.webp",
    "nameTh": "เย็นตาโฟ",
    "nameEn": "Yen Ta Fo Pink Noodle Soup",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 300,
        "max": 450
      },
      "proteinG": {
        "min": 12,
        "max": 22
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ถ้าอยากเพิ่มโปรตีน เลือกเพิ่มเนื้อสัตว์แทนการเพิ่มเส้น",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "roast-pork-wonton-noodles",
    "image": "/everyday-meals/roast-pork-wonton-noodles.webp",
    "nameTh": "บะหมี่เกี๊ยวหมูแดง",
    "nameEn": "Roast Pork and Wonton Egg Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 350,
        "max": 500
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 ชาม ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "preparation",
        "labelTh": "รูปแบบ",
        "choices": [
          {
            "id": "soup",
            "labelTh": "น้ำ"
          },
          {
            "id": "dry",
            "labelTh": "แห้ง"
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "ถ้าอยากเพิ่มโปรตีน เลือกเพิ่มเนื้อสัตว์แทนการเพิ่มเส้น",
        "type": "more-protein"
      }
    ]
  },
  {
    "id": "pork-rad-na",
    "image": "/everyday-meals/pork-rad-na.webp",
    "nameTh": "ราดหน้าหมู",
    "nameEn": "Pork Noodles in Gravy",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 550
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอเพิ่มผักได้",
        "type": "more-vegetables"
      }
    ]
  },
  {
    "id": "pork-pad-see-ew",
    "image": "/everyday-meals/pork-pad-see-ew.webp",
    "nameTh": "ผัดซีอิ๊วหมู",
    "nameEn": "Pork Pad See Ew",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอเพิ่มผักได้",
        "type": "more-vegetables"
      }
    ]
  },
  {
    "id": "chicken-kua-noodles",
    "image": "/everyday-meals/chicken-kua-noodles.webp",
    "nameTh": "ก๋วยเตี๋ยวคั่วไก่",
    "nameEn": "Chicken Kua Noodles",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    }
  },
  {
    "id": "shrimp-pad-thai",
    "image": "/everyday-meals/shrimp-pad-thai.webp",
    "nameTh": "ผัดไทยกุ้งสด",
    "nameEn": "Fresh Shrimp Pad Thai",
    "category": "noodle",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    }
  },
  {
    "id": "minced-pork-basil-rice",
    "image": "/everyday-meals/minced-pork-basil-rice.webp",
    "nameTh": "ข้าวกะเพราหมูสับ",
    "nameEn": "Minced Pork Basil with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "boiled-egg",
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "chicken-basil-rice",
    "image": "/everyday-meals/chicken-basil-rice.webp",
    "nameTh": "ข้าวกะเพราไก่",
    "nameEn": "Chicken Basil with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "boiled-egg",
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "beef-basil-rice",
    "image": "/everyday-meals/beef-basil-rice.webp",
    "nameTh": "ข้าวกะเพราเนื้อ",
    "nameEn": "Beef Basil with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "boiled-egg",
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "garlic-pork-rice",
    "image": "/everyday-meals/garlic-pork-rice.webp",
    "nameTh": "ข้าวหมูกระเทียม",
    "nameEn": "Garlic Pork with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "garlic-chicken-rice",
    "image": "/everyday-meals/garlic-chicken-rice.webp",
    "nameTh": "ข้าวไก่กระเทียม",
    "nameEn": "Garlic Chicken with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "pork-red-curry-rice",
    "image": "/everyday-meals/pork-red-curry-rice.webp",
    "nameTh": "ข้าวพริกแกงหมู",
    "nameEn": "Pork Red Curry Stir-fry with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "chicken-red-curry-rice",
    "image": "/everyday-meals/chicken-red-curry-rice.webp",
    "nameTh": "ข้าวพริกแกงไก่",
    "nameEn": "Chicken Red Curry Stir-fry with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "pork-kale-rice",
    "image": "/everyday-meals/pork-kale-rice.webp",
    "nameTh": "ข้าวคะน้าหมู",
    "nameEn": "Pork and Kale with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "pork-mixed-vegetables-rice",
    "image": "/everyday-meals/pork-mixed-vegetables-rice.webp",
    "nameTh": "ข้าวผัดผักรวมหมู",
    "nameEn": "Pork and Mixed Vegetables with Rice",
    "category": "rice",
    "tags": [
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "pork-fried-rice",
    "image": "/everyday-meals/pork-fried-rice.webp",
    "nameTh": "ข้าวผัดหมู",
    "nameEn": "Pork Fried Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 650
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "shrimp-fried-rice",
    "image": "/everyday-meals/shrimp-fried-rice.webp",
    "nameTh": "ข้าวผัดกุ้ง",
    "nameEn": "Shrimp Fried Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 600
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "addOnIds": [
      "fried-egg"
    ],
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "crab-fried-rice",
    "image": "/everyday-meals/crab-fried-rice.webp",
    "nameTh": "ข้าวผัดปู",
    "nameEn": "Crab Fried Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 600
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "minced-pork-omelet-rice",
    "image": "/everyday-meals/minced-pork-omelet-rice.webp",
    "nameTh": "ข้าวไข่เจียวหมูสับ",
    "nameEn": "Minced Pork Omelet with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ],
    "nutritionNotes": [
      "พลังงานอาจต่างกันค่อนข้างมากตามปริมาณน้ำมันที่ใช้ทอด"
    ]
  },
  {
    "id": "chicken-creamy-egg-rice",
    "image": "/everyday-meals/chicken-creamy-egg-rice.webp",
    "nameTh": "ข้าวไข่ข้นไก่",
    "nameEn": "Creamy Eggs and Chicken with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอข้าวน้อยได้ถ้าอยากลดปริมาณข้าว",
        "type": "lighter"
      }
    ],
    "nutritionNotes": [
      "ปริมาณไข่ เนื้อไก่ เนยหรือน้ำมัน ทำให้พลังงานต่างกันได้มาก"
    ]
  },
  {
    "id": "hainanese-chicken-rice",
    "image": "/everyday-meals/hainanese-chicken-rice.webp",
    "nameTh": "ข้าวมันไก่",
    "nameEn": "Hainanese Chicken Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 650
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "chicken-part",
        "labelTh": "ส่วนไก่",
        "choices": [
          {
            "id": "breast",
            "labelTh": "อก"
          },
          {
            "id": "drumstick",
            "labelTh": "น่อง"
          },
          {
            "id": "thigh",
            "labelTh": "สะโพก"
          }
        ]
      },
      {
        "id": "skin",
        "labelTh": "หนัง",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "ติดหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ลอกหนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "ถ้าอยากเบาลง เลือกอก ลอกหนัง และขอข้าวน้อยได้",
        "type": "lighter"
      }
    ]
  },
  {
    "id": "fried-chicken-rice",
    "image": "/everyday-meals/fried-chicken-rice.webp",
    "nameTh": "ข้าวมันไก่ทอด",
    "nameEn": "Fried Chicken with Fragrant Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 18,
        "max": 28
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "nutritionNotes": [
      "ปริมาณแป้งทอด หนังไก่ น้ำมัน และข้าวมันทำให้พลังงานต่างกันได้"
    ]
  },
  {
    "id": "roast-red-pork-rice",
    "image": "/everyday-meals/roast-red-pork-rice.webp",
    "nameTh": "ข้าวหมูแดง",
    "nameEn": "Roast Red Pork with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 550
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอราดน้ำน้อยได้",
        "type": "general"
      }
    ]
  },
  {
    "id": "crispy-pork-rice",
    "image": "/everyday-meals/crispy-pork-rice.webp",
    "nameTh": "ข้าวหมูกรอบ",
    "nameEn": "Crispy Pork with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 600,
        "max": 750
      },
      "proteinG": {
        "min": 15,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ขอราดน้ำน้อยได้",
        "type": "general"
      }
    ]
  },
  {
    "id": "braised-pork-leg-rice",
    "image": "/everyday-meals/braised-pork-leg-rice.webp",
    "nameTh": "ข้าวขาหมู",
    "nameEn": "Braised Pork Leg with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 600,
        "max": 750
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "skin",
        "labelTh": "หนัง",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "มีหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ไม่หนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ],
    "addOnIds": [
      "boiled-egg"
    ]
  },
  {
    "id": "roast-duck-rice",
    "image": "/everyday-meals/roast-duck-rice.webp",
    "nameTh": "ข้าวหน้าเป็ด",
    "nameEn": "Roast Duck with Rice",
    "category": "rice",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 25,
        "max": 32
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "skin",
        "labelTh": "หนัง",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "ติดหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ไม่หนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "ขอราดน้ำน้อยได้",
        "type": "general"
      }
    ]
  },
  {
    "id": "fried-pork-rice",
    "image": "/everyday-meals/fried-pork-rice.webp",
    "nameTh": "ข้าวหมูทอด",
    "nameEn": "Fried Pork with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 700
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    }
  },
  {
    "id": "grilled-chicken-rice",
    "image": "/everyday-meals/grilled-chicken-rice.webp",
    "nameTh": "ข้าวไก่ย่าง",
    "nameEn": "Grilled Chicken with Rice",
    "category": "rice",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 25,
        "max": 35
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "skin",
        "labelTh": "หนัง",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "ติดหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ลอกหนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ]
  },
  {
    "id": "shrimp-paste-rice",
    "image": "/everyday-meals/shrimp-paste-rice.webp",
    "nameTh": "ข้าวคลุกกะปิ",
    "nameEn": "Shrimp Paste Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 650
      },
      "proteinG": {
        "min": 20,
        "max": 25
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "nutritionNotes": [
      "พลังงานต่างกันได้ตามปริมาณหมูหวาน กุนเชียง ไข่ และน้ำมัน"
    ]
  },
  {
    "id": "grilled-pork-jaew-rice",
    "image": "/everyday-meals/grilled-pork-jaew-rice.webp",
    "nameTh": "ข้าวหมูย่างจิ้มแจ่ว",
    "nameEn": "Grilled Pork with Jaew Sauce and Rice",
    "category": "rice",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 450,
        "max": 650
      },
      "proteinG": {
        "min": 25,
        "max": 35
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "แยกน้ำจิ้มได้ถ้าอยากควบคุมปริมาณน้ำจิ้ม",
        "type": "general"
      }
    ]
  },
  {
    "id": "grilled-chicken-jaew-rice",
    "image": "/everyday-meals/grilled-chicken-jaew-rice.webp",
    "nameTh": "ข้าวไก่ย่างจิ้มแจ่ว",
    "nameEn": "Grilled Chicken with Jaew Sauce and Rice",
    "category": "rice",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 25,
        "max": 35
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "skin",
        "labelTh": "หนัง",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "ติดหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ลอกหนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "แยกน้ำจิ้มได้ถ้าอยากควบคุมปริมาณน้ำจิ้ม",
        "type": "general"
      }
    ]
  },
  {
    "id": "pork-larb-rice",
    "image": "/everyday-meals/pork-larb-rice.webp",
    "nameTh": "ข้าวลาบหมู",
    "nameEn": "Pork Larb with Rice",
    "category": "rice",
    "tags": [],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 550
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    }
  },
  {
    "id": "pork-nam-tok-rice",
    "image": "/everyday-meals/pork-nam-tok-rice.webp",
    "nameTh": "ข้าวน้ำตกหมู",
    "nameEn": "Pork Nam Tok with Rice",
    "category": "rice",
    "tags": [
      "high-protein"
    ],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 550
      },
      "proteinG": {
        "min": 22,
        "max": 32
      },
      "servingAssumption": "1 จาน ขนาดร้านอาหารทั่วไป",
      "confidence": "medium"
    }
  },
  {
    "id": "papaya-salad-grilled-chicken-sticky-rice",
    "image": "/everyday-meals/papaya-salad-grilled-chicken-sticky-rice.webp",
    "nameTh": "ส้มตำ + ไก่ย่าง + ข้าวเหนียว",
    "nameEn": "Papaya Salad, Grilled Chicken and Sticky Rice",
    "category": "rice",
    "tags": [
      "high-protein",
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 500,
        "max": 750
      },
      "proteinG": {
        "min": 25,
        "max": 40
      },
      "servingAssumption": "1 ชุด ขนาดมื้อทั่วไป",
      "confidence": "medium"
    },
    "optionGroups": [
      {
        "id": "chicken-skin",
        "labelTh": "หนังไก่",
        "choices": [
          {
            "id": "with-skin",
            "labelTh": "ติดหนัง"
          },
          {
            "id": "skinless",
            "labelTh": "ลอกหนัง",
            "nutritionEffect": "lower-energy"
          }
        ]
      }
    ],
    "orderingTips": [
      {
        "textTh": "ปรับปริมาณข้าวเหนียวได้ตามความหิว",
        "type": "general"
      },
      {
        "textTh": "เพิ่มผักเคียงได้ตามชอบ",
        "type": "more-vegetables"
      }
    ]
  },
  {
    "id": "pork-larb-sticky-rice-vegetables",
    "image": "/everyday-meals/pork-larb-sticky-rice-vegetables.webp",
    "nameTh": "ลาบหมู + ข้าวเหนียว + ผัก",
    "nameEn": "Pork Larb, Sticky Rice and Vegetables",
    "category": "rice",
    "tags": [
      "high-protein",
      "veggie-rich"
    ],
    "nutrition": {
      "kcal": {
        "min": 400,
        "max": 600
      },
      "proteinG": {
        "min": 20,
        "max": 30
      },
      "servingAssumption": "1 ชุด ขนาดมื้อทั่วไป",
      "confidence": "medium"
    },
    "orderingTips": [
      {
        "textTh": "ปรับปริมาณข้าวเหนียวได้ตามความหิว",
        "type": "general"
      },
      {
        "textTh": "เพิ่มผักเคียงได้ตามชอบ",
        "type": "more-vegetables"
      }
    ]
  }
]

export const mealAddOns: MealAddOn[] = [
  {
    "id": "boiled-egg",
    "nameTh": "ไข่ต้ม",
    "nameEn": "Boiled Egg",
    "nutrition": {
      "kcal": {
        "min": 70,
        "max": 70
      },
      "servingAssumption": "1 ฟอง ขนาดทั่วไป (พลังงานโดยประมาณ)",
      "confidence": "medium"
    }
  },
  {
    "id": "fried-egg",
    "nameTh": "ไข่ดาว",
    "nameEn": "Fried Egg",
    "nutrition": {
      "kcal": {
        "min": 150,
        "max": 150
      },
      "servingAssumption": "1 ฟอง ขนาดทั่วไป ปัดพลังงานโดยประมาณเป็น 150 kcal",
      "confidence": "medium"
    }
  }
]
