function applyWeatherRules(disease, weather) {
  let weatherAdvice = [];

  if (!weather) {
    weatherAdvice.push(
      "Mausam ka data available nahi hai, isliye general salah di ja rahi hai."
    );
    return weatherAdvice;
  }

  const { temperature, humidity, condition } = weather;

  // 🔴 Sugarcane Leaf Scald (Bacterial)
  if (disease === "Sugarcane_Leaf_Scald") {
    if (humidity >= 80) {
      weatherAdvice.push(
        "Zyada humidity ke kaaran bacterial infection tez ho sakta hai. Over-irrigation se bachein."
      );
    }
    if (condition.toLowerCase().includes("rain")) {
      weatherAdvice.push(
        "Barsaat ke mausam me disease aur fail sakti hai. Aaj spray avoid karein."
      );
    }
  }

  // 🔴 Sugarcane Red Rot (Fungal)
  if (disease === "Sugarcane_Red_Rot") {
    if (humidity >= 75) {
      weatherAdvice.push(
        "Nami zyada hone par fungal disease badhne ka risk hota hai."
      );
    }
    if (condition.toLowerCase().includes("rain")) {
      weatherAdvice.push(
        "Lagataar barsaat se mitti me fungus badhta hai. Proper drainage zaroori hai."
      );
    }
  }

  // 🟢 Healthy
  if (disease === "Sugarcane_Healthy") {
    if (temperature >= 30 && humidity <= 70) {
      weatherAdvice.push(
        "Mausam sugarcane ke liye anukool hai. Current practices continue rakhein."
      );
    } else {
      weatherAdvice.push(
        "Mausam thoda badal raha hai. Field observation regular rakhein."
      );
    }
  }

  // Default fallback
  if (weatherAdvice.length === 0) {
    weatherAdvice.push(
      "Mausam ke hisaab se koi specific alert nahi hai."
    );
  }

  return weatherAdvice;
}

module.exports = { applyWeatherRules };
