const advisory = {
  Sugarcane_Healthy: {
    reason:
      "Aapki sugarcane fasal healthy hai. Plant ko proper nutrition aur care mil rahi hai.",

    effects: [
      "Plant normal grow karega",
      "Yield achha milega",
      "Koi disease ka nuksaan nahi"
    ],

    treatment: [
      "Koi medicine ki zarurat nahi",
      "Regular irrigation aur fertilizer follow karein"
    ],

    prevention: [
      "Certified beej ka use karein",
      "Field me pani jama na hone dein",
      "Time-time par field inspection karein"
    ]
  },

  Sugarcane_Red_Rot: {
    reason:
      "Ye ek fungal disease hai jo infected beej, mitti aur pani jama hone ki wajah se hoti hai.",

    effects: [
      "Ganne ka andar laal ho jata hai",
      "Plant kamzor ho jata hai",
      "Yield aur quality kam ho jati hai"
    ],

    treatment: [
      "Infected plants ko turant nikaal kar jala dein",
      "Carbendazim 0.1% ya Bavistin ka spray karein",
      "Fungicide lagate waqt gloves use karein"
    ],

    prevention: [
      "Resistant variety ka beej use karein",
      "Beej ko fungicide se treat karke hi boya jaye",
      "Proper drainage maintain karein"
    ]
  },

  Sugarcane_Leaf_Scald: {
    reason:
      "Ye ek bacterial disease hai jo zyada nami, infected beej aur gande tools se failti hai.",

    effects: [
      "Patton par safed ya peeli lines dikhai deti hain",
      "Patte jalne jaise lagte hain",
      "Plant ka growth ruk jata hai"
    ],

    treatment: [
      "Streptocycline 0.01% ka spray karein",
      "Copper oxychloride ka upyog karein",
      "Bahut zyada infected plants hata dein"
    ],

    prevention: [
      "Certified disease-free beej ka use karein",
      "Tools ko bleach ya phenyl se saaf karein",
      "Over-irrigation se bachein"
    ]
  }
};

module.exports = advisory;
