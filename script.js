let health = 15;
let armor = 2;
let ap = 3;
let startingAP = 3;
let activeProfile = "selene";
let rollHistory = [];

const championProfiles = {
  selene: {
    name: "Selene",
    icon: "☾",
    health: 15,
    armor: 2,
    ap: 3,
    attributes: {
      might: 1,
      speed: 4,
      resolve: 2,
      focus: 5,
      influence: 3
    },
    passiveTitle: "Passive — Calculated Future",
    passiveText: "Once per turn, after a D20 roll, you may increase or decrease the result by 1.",
    basic: "Basic Attack: 1 AP → 1 Damage",
    signatureName: "Command Reality",
    signatureAttribute: "focus",
    signatureDifficulty: 17,
    signatureCost: 2
  },
  mark: {
    name: "Mark",
    icon: "⚔",
    health: 18,
    armor: 2,
    ap: 2,
    attributes: {
      might: 5,
      speed: 2,
      resolve: 4,
      focus: 1,
      influence: 3
    },
    passiveTitle: "Passive — Berserker Spirit",
    passiveText: "When Mark is below half health, gain +1 AP and add +2 Might to all Might checks.",
    basic: "Basic Attack: 1 AP → 1 Damage",
    signatureName: "Rage Surge",
    signatureAttribute: "might",
    signatureDifficulty: 18,
    signatureCost: 2
  },
  custom: {
    name: "Custom Champion",
    icon: "♙",
    health: 20,
    armor: 0,
    ap: 6,
    attributes: {
      might: 3,
      speed: 3,
      resolve: 3,
      focus: 3,
      influence: 3
    },
    passiveTitle: "Passive — Custom",
    passiveText: "Use this slot for testing a custom Champion.",
    basic: "Basic Attack: 1 AP → 1 Damage",
    signatureName: "Signature Ability",
    signatureAttribute: "focus",
    signatureDifficulty: 17,
    signatureCost: 2
  }
};

let attributes = { ...championProfiles.selene.attributes };

function setText(id, value) {
  document.getElementById(id).innerText = value;
}

function getActiveProfile() {
  return championProfiles[activeProfile];
}

function loadChampionProfile() {
  activeProfile = document.getElementById("championSelect").value;
  resetGame();
}

function updateChampionInfo() {
  const profile = getActiveProfile();
  setText("championIcon", profile.icon);
  setText("championPassiveTitle", profile.passiveTitle);
  setText("championPassiveText", profile.passiveText);
  setText("championBasic", profile.basic);
  setText("signatureName", profile.signatureName);
  setText("signatureText", profile.signatureCost + " AP • " + capitalize(profile.signatureAttribute) + " " + profile.signatureDifficulty);
}

function updateDisplay() {
  setText("health", health);
  setText("armor", armor);
  setText("ap", ap);
  for (const attribute in attributes) {
    setText(attribute, attributes[attribute]);
  }

  updateChampionInfo();
}

function clearRoll() {
  const resultBox = document.getElementById("rollResult");
  const formulaBox = document.getElementById("rollFormula");

  resultBox.className = "";
  resultBox.innerText = "Tap an attribute to roll";
  formulaBox.innerText = "d20 + attribute = total";
}

function changeHealth(amount) {
  health += amount;
  if (health < 0) health = 0;
  setText("health", health);
}

function changeArmor(amount) {
  armor += amount;
  if (armor < 0) armor = 0;
  setText("armor", armor);
}

function changeAP(amount) {
  ap += amount;
  if (ap < 0) ap = 0;
  setText("ap", ap);
}

function changeAttribute(attribute, amount) {
  attributes[attribute] += amount;
  if (attributes[attribute] < 0) attributes[attribute] = 0;
  setText(attribute, attributes[attribute]);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function rollAttribute(attribute, difficulty = null, label = null) {
  const roll = Math.floor(Math.random() * 20) + 1;
  const bonus = attributes[attribute];
  const total = roll + bonus;
  const name = label || capitalize(attribute);
  const resultBox = document.getElementById("rollResult");
  const formulaBox = document.getElementById("rollFormula");

  resultBox.className = "";

  let status = "";
  if (roll === 20) {
    resultBox.classList.add("nat20");
    status = "NAT 20!";
  } else if (roll === 1) {
    resultBox.classList.add("nat1");
    status = "NAT 1!";
  } else if (difficulty !== null && total >= difficulty) {
    resultBox.classList.add("success");
    status = "SUCCESS!";
  } else if (difficulty !== null) {
    resultBox.classList.add("fail");
    status = "FAIL";
  }

  resultBox.innerText = (status ? status + " " : "") + name + " Total: " + total;
  formulaBox.innerText = "d20 roll " + roll + " + " + capitalize(attribute) + " " + bonus + " = " + total + (difficulty ? " vs " + difficulty : "");

  addRollHistory(name + ": " + roll + " + " + bonus + " = " + total + (difficulty ? " vs " + difficulty : ""));
}

function rollSignature() {
  const profile = getActiveProfile();

  if (ap < profile.signatureCost) {
    const resultBox = document.getElementById("rollResult");
    resultBox.className = "fail";
    resultBox.innerText = "Not enough AP for " + profile.signatureName;
    document.getElementById("rollFormula").innerText = "Need " + profile.signatureCost + " AP";
    return;
  }

  ap -= profile.signatureCost;
  setText("ap", ap);
  rollAttribute(profile.signatureAttribute, profile.signatureDifficulty, profile.signatureName);
}

function addRollHistory(entry) {
  rollHistory.unshift(entry);
  rollHistory = rollHistory.slice(0, 3);
  document.getElementById("rollHistory").innerHTML = rollHistory.join("<br>");
}

function nextTurn() {
  ap = startingAP;
  updateDisplay();
}

function resetGame() {
  const profile = getActiveProfile();

  health = profile.health;
  armor = profile.armor;
  ap = profile.ap;
  startingAP = profile.ap;
  attributes = { ...profile.attributes };
  rollHistory = [];

  updateDisplay();
  clearRoll();
  setText("rollHistory", "No rolls yet.");
}

function newGame() {
  resetGame();
}

function toggleMenu(){
 const menu = document.getElementById("menuDropdown");
 menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function showOnly(pageId){
  ["trackerPage", "rulesPage", "campaignPage"].forEach(id => {
    const page = document.getElementById(id);
    if (!page) return;
    page.style.display = id === pageId ? "block" : "none";
  });
  document.getElementById("menuDropdown").style.display="none";
}

function showTracker(){
  showOnly("trackerPage");
}

function showRules(){
  showOnly("rulesPage");
}

function showCampaign(){
  showOnly("campaignPage");
  updateCampaignDisplay();
}


/* =========================
   Campaign Mode
   3 Waves + Boss Room
   ========================= */
const campaignNames = {
  aggressive: ["Iron Raider", "Crimson Duelist", "Ragebound Knight"],
  defensive: ["Stone Guard", "Shield Warden", "Aegis Sentinel"],
  control: ["Arcane Shade", "Mindbinder", "Chrono Adept"],
  boss: ["Void Titan", "Crownless King", "Abyss Dragon"]
};

const campaignTraits = {
  aggressive: ["Aggressive: Basic attacks deal +1 damage.", "Pressure: Attacks more often when ahead.", "Bloodlust: Deals +1 damage below half Health."],
  defensive: ["Defensive: Starts with bonus Armor.", "Guardian: Reduces first damage each turn by 1.", "Fortified: Gains Armor after attacking."],
  control: ["Control: First roll each turn gains +1.", "Disruption: May reduce your AP by 1.", "Focus: Signature-style attacks roll with a bonus."],
  boss: ["Boss Passive: Every third turn, unleashes a heavy attack.", "Boss Passive: Reduces the first damage each turn by 1.", "Boss Passive: Gains +1 AP when below half Health."]
};

let campaign = {
  active: false,
  room: 0,
  bossUnlocked: false,
  playerHP: 0,
  enemy: null,
  log: [],
  enemyTurn: 0
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getCampaignChampionProfile() {
  const selected = document.getElementById("campaignChampion")?.value || "current";
  if (selected === "current") return getActiveProfile();
  return championProfiles[selected] || getActiveProfile();
}

function generateCampaignEnemy(room) {
  const isBoss = room === 4;
  const type = isBoss ? "boss" : pickRandom(["aggressive", "defensive", "control"]);
  const waveScale = [0, 0.7, 0.9, 1.1, 1.5][room];
  const baseHP = isBoss ? 34 : Math.round(12 + room * 3 + waveScale * 2);
  const apValue = isBoss ? 5 : Math.min(4, 1 + room);
  const armorValue = type === "defensive" ? room + 1 : isBoss ? 3 : room - 1;

  return {
    type,
    isBoss,
    name: pickRandom(campaignNames[type]),
    icon: isBoss ? "👑" : type === "aggressive" ? "⚔" : type === "defensive" ? "🛡" : "🔮",
    maxHP: baseHP,
    hp: baseHP,
    ap: apValue,
    armor: Math.max(0, armorValue),
    bonus: isBoss ? 4 : room,
    trait: pickRandom(campaignTraits[type])
  };
}

function startCampaign() {
  const profile = getCampaignChampionProfile();
  campaign = {
    active: true,
    room: 1,
    bossUnlocked: false,
    playerHP: profile.health,
    enemy: generateCampaignEnemy(1),
    log: [],
    enemyTurn: 0
  };
  addCampaignLog(`Campaign started with ${profile.name}. Wave 1 generated.`);
  updateCampaignDisplay();
}

function addCampaignLog(message) {
  campaign.log.unshift(message);
  campaign.log = campaign.log.slice(0, 12);
  const box = document.getElementById("campaignLog");
  if (box) box.innerHTML = campaign.log.map(line => `<div>${line}</div>`).join("");
}

function updateCampaignDisplay() {
  const enemy = campaign.enemy;
  const roomLabel = !campaign.active ? "—" : campaign.room < 4 ? `Wave ${campaign.room}` : "Boss Room";
  setText("campaignProgress", !campaign.active ? "Not Started" : campaign.room < 4 ? `${campaign.room}/3 Waves` : "Boss Fight");
  setText("campaignRoom", roomLabel);
  setText("campaignPlayerHP", campaign.active ? campaign.playerHP : "—");
  setText("campaignEnemyHP", enemy ? `${enemy.hp}/${enemy.maxHP}` : "—");
  setText("campaignEnemyIcon", enemy ? enemy.icon : "?");
  setText("campaignEnemyName", enemy ? enemy.name : "No Enemy Generated");
  setText("campaignEnemyTrait", enemy ? enemy.trait : "Start a campaign to generate Wave 1.");
  setText("campaignEnemyStats", enemy ? `AP ${enemy.ap} • Armor ${enemy.armor} • Roll Bonus +${enemy.bonus}` : "Balanced scaling keeps waves beatable and boss room challenging.");
}

function campaignDamageEnemy(amount) {
  if (!campaign.active || !campaign.enemy) return;
  const enemy = campaign.enemy;
  let damage = amount;
  if (enemy.armor > 0) {
    const blocked = Math.min(enemy.armor, damage);
    enemy.armor -= blocked;
    damage -= blocked;
  }
  enemy.hp = Math.max(0, enemy.hp - damage);
  updateCampaignDisplay();
  if (enemy.hp <= 0) {
    addCampaignLog(`${enemy.name} defeated. ${campaign.room < 4 ? "Advance to the next room." : "Boss defeated — campaign cleared!"}`);
  }
}

function campaignPlayerAttack() {
  if (!campaign.active || !campaign.enemy) return;
  campaignDamageEnemy(2);
  addCampaignLog(`You used Basic Attack for 2 damage.`);
}

function campaignPlayerSignature() {
  if (!campaign.active || !campaign.enemy) return;
  const profile = getCampaignChampionProfile();
  const roll = Math.floor(Math.random() * 20) + 1;
  const bonus = attributes[profile.signatureAttribute] || profile.attributes[profile.signatureAttribute] || 0;
  const total = roll + bonus;

  if (roll === 20) {
    campaignDamageEnemy(6);
    addCampaignLog(`NAT 20! ${profile.signatureName}: ${roll} + ${bonus} = ${total}. Deal 6 damage.`);
  } else if (roll === 1) {
    addCampaignLog(`NAT 1! ${profile.signatureName} failed.`);
  } else if (total >= profile.signatureDifficulty) {
    campaignDamageEnemy(4);
    addCampaignLog(`${profile.signatureName} succeeded: ${roll} + ${bonus} = ${total}. Deal 4 damage.`);
  } else {
    addCampaignLog(`${profile.signatureName} failed: ${roll} + ${bonus} = ${total}.`);
  }
}

function campaignEnemyTurn() {
  if (!campaign.active || !campaign.enemy || campaign.enemy.hp <= 0) return;
  const enemy = campaign.enemy;
  campaign.enemyTurn++;
  let damage = enemy.type === "aggressive" ? 3 : enemy.type === "control" ? 2 : 1;
  if (enemy.isBoss) damage = campaign.enemyTurn % 3 === 0 ? 6 : 3;
  if (enemy.type === "defensive") enemy.armor += 1;
  if (enemy.type === "control" && Math.random() < 0.35) damage += 1;
  campaign.playerHP = Math.max(0, campaign.playerHP - damage);
  addCampaignLog(`${enemy.name} attacks for ${damage}. Your campaign HP is now ${campaign.playerHP}.`);
  if (campaign.playerHP <= 0) addCampaignLog("Campaign failed. Reset and try again.");
  updateCampaignDisplay();
}

function advanceCampaignRoom() {
  if (!campaign.active) return;
  if (!campaign.enemy || campaign.enemy.hp > 0) {
    addCampaignLog("Defeat the current enemy before advancing.");
    return;
  }
  if (campaign.room < 3) {
    campaign.room++;
    campaign.enemy = generateCampaignEnemy(campaign.room);
    campaign.enemyTurn = 0;
    campaign.playerHP += 3;
    addCampaignLog(`Wave ${campaign.room} begins. You recover 3 HP.`);
  } else if (campaign.room === 3) {
    campaign.room = 4;
    campaign.bossUnlocked = true;
    campaign.enemy = generateCampaignEnemy(4);
    campaign.enemyTurn = 0;
    campaign.playerHP += 5;
    addCampaignLog("Boss Room unlocked. You recover 5 HP before the challenge.");
  } else {
    addCampaignLog("Campaign already cleared. Start a new campaign to play again.");
  }
  updateCampaignDisplay();
}

window.onload = function() {
  document.getElementById("championSelect").value = activeProfile;
  resetGame();
  updateCampaignDisplay();
};
