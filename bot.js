const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(auth.token);

this.activeMonster;
this.monsters = [
  {
    name: "Ankheg",
    curHp: 39,
    maxHp: 39,
    looted: false
  },

  {
    name: "Goblin",
    curHp: 7,
    maxHp: 7,
    looted: false
  },

  {
    name: "Tarrasque",
    curHp: 676,
    maxHp: 676,
    looted: false
  },

  {
    name: "Ancient Blue Dragon",
    curHp: 481,
    maxHp: 481,
    looted: false
  },

  {
    name: "Troll",
    curHp: 84,
    maxHp: 84,
    looted: false
  }
];
this.rareLoot = [
  {
    name: "Ring of Feather Fall"
  },
  {
    name: "Potion of Healing"
  },
  {
    name: "Vorpal Sword"
  },
  {
    name: "Mithral Armor"
  },
  {
    name: "Bag of Holding"
  }
];

client.on("message", msg => {
  let args = msg.content.split(" ");

  if (args[0] === "!help") {
    msg.reply(
      [
        "MonsterBot Help",
        "!monster -    Make a random monster appear!",
        "!attack [N] - Attack the monster! [N] is any number.",
        "!loot -       Loot the monster once you've defeated it!"
      ].join("\n")
    );
  }

  // Win!
  if (args[0] === "!flute") {
    msg.reply("Da da da da, du duh, da du da!");
  }

  /**
   * Monster Functionality
   */
  if (args[0] === "!monster") {
    let rando = Math.floor(Math.random() * this.monsters.length);
    this.activeMonster = this.monsters[rando];
    msg.reply(
      "A wild **" +
        this.activeMonster.name +
        "** appears and attacks! Use `!help` for more info.\n"
    );
  }

  /**
   * Attack Functionality
   */
  if (args[0] === "!attack") {
    //console.log("command: " + args[0] + " " + args[1]);
    let damage = args[1];
    let messageText = "";

    /**
     * There are 3 scenarios for damage:
     * 1. damage amount is negative aka. a heal
     * 2. damage amount is 0, which in this case, LOL
     * 3. damage amount is positive
     */

    // Scenario 1: Heal
    if (damage < 0) {
      if (
        this.activeMonster.curHp < this.activeMonster.maxHp &&
        this.activeMonster.curHp + Math.abs(damage) <= this.activeMonster.maxHp
      ) {
        this.activeMonster.curHp += Math.abs(damage);
      } else {
        this.activeMonster.curHp = this.activeMonster.maxHp;
      }

      messageText =
        "Uhh, hmm... Your attack seems to have healed the beast! Oops?";
    }

    // Scenario 2: LOL
    if (damage == 0) {
      messageText = "**LOL!**";
    }

    // Scenario 3: Damage
    if (damage > 0) {
      /**
       * Here we have 2 scenarios
       * 1. damage killed the monster
       * 2. damage didn't kill the monster
       */

      // Scenario 1: Killed
      if (this.activeMonster.curHp - damage <= 0) {
        this.activeMonster.curHp = 0;
        messageText =
          "**You did it!** The " + this.activeMonster.name + " is slain!";
      }

      // Scenario 2: Didn't Kill
      if (this.activeMonster.curHp - damage > 0) {
        let emote = "**Ouch!**";
        if (damage < 5) {
          emote = "**LOL!**";
        }

        this.activeMonster.curHp -= damage;
        messageText =
          emote +
          " The " +
          this.activeMonster.name +
          " took some damage. The fight has just begun!";

        if (this.activeMonster.curHp <= this.activeMonster.maxHp / 2) {
          messageText =
            emote +
            " The " +
            this.activeMonster.name +
            " is bloodied. Keep fighting!";
        }

        if (this.activeMonster.curHp <= this.activeMonster.maxHp / 3) {
          messageText =
            emote +
            " The " +
            this.activeMonster.name +
            " is looking really bad. Finish it off!";
        }
      }
    }

    msg.reply(messageText);
  }

  /**
   * Loot Functionality
   */
  if (args[0] === "!loot") {
    // Set default for greedy adventurers
    let messageText =
      "The " + this.activeMonster.name + " is not quite dead yet.";

    // monster must be dead to loot, unless...
    if (this.activeMonster.curHp <= 0) {
      if (this.activeMonster.looted == false) {
        let money = Math.floor(Math.random() * 1000);

        // You always get gold
        messageText = "You found " + money + "gp!";

        // You sometimes (15%) get rare loot
        let chance = Math.floor(Math.random() * 100);
        if (chance > 0 && chance < 15) {
          let lootRoll = Math.floor(Math.random() * this.rareLoot.length);
          let rareLoot = this.rareLoot[lootRoll];

          messageText +=
            " You also found the following rare loot! [" + rareLoot.name + "]";
        }

        this.activeMonster.looted = true;
      } else {
        messageText =
          "This monster's been looted! Seems like someone else rolled really well on their slight of hand check...";
      }
    }

    msg.reply(messageText);
  }
});
