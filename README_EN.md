# Password - Gamified Password Generator

> Generate passwords like forging RPG equipment - password strength = gear rarity.

[<- Back to Muripo HQ](https://tznthou.github.io/muripo-hq/) | [中文](README.md)

## TL;DR

A gamified password generator. Clicking "Reforge" triggers shake animations, scrambled text rolling, and rarity reveal effects. Password strength is displayed as RPG gear rarity, from "Rusty Iron Sword" to "Developer Backdoor". Unidentified mode prevents shoulder surfing.

## Demo

```
+------------------------------------+
| LEGENDARY                          |
| World Boss Drop                    |
| +--------------------------------+ |
| | ????????????????               | |
| +--------------------------------+ |
| Defense: Iron Wall +142            |
| Crack Time: Time itself will perish|
| [Identify] [Loot]                  |
+------------------------------------+
        [Reforge]
```

## Quick Start

Just open `index.html` in your browser.

## Features

- **Forging animation** - Shake, scrambled text rolling, rarity glow reveal
- **Rarity system** - 6 rarity tiers corresponding to password strength
- **Unidentified mode** - Password hidden by default, hold to identify
- **Gamified stats** - Random defense descriptors + fun crack time messages
- **Cryptographically secure** - Uses `crypto.getRandomValues()`
- **One-click loot** - Copy password to clipboard

## Rarity Tiers

| Rarity | Color | Entropy | Gear Name |
|--------|-------|---------|-----------|
| Common | Gray | < 28 | Rusty Iron Sword |
| Magic | Blue | 28-44 | Enchanted Dagger |
| Rare | Gold | 45-64 | Forged Battle Axe |
| Epic | Purple | 65-84 | Ancient Artifact |
| Legendary | Orange | 85-109 | World Boss Drop |
| Primal | Red | 110+ | Developer Backdoor |

## Forging Animation Flow

1. Card shake + hammer rotation
2. Password area scrambled text rolling (blind mode shows `???` flashing)
3. Display "Forging..." "Sparks flying"
4. Reveal: Card glow + rarity flash + stat numbers jumping

## Technical Details

### Entropy Calculation

```
Entropy = log2(character pool size) x password length
```

### Crack Time Messages

| Time Level | Example Message |
|------------|-----------------|
| Instant | Insta-kill, Vaporized instantly |
| Seconds | A matter of seconds, Blink of an eye |
| Minutes | Instant noodles aren't even ready |
| Hours | Time to binge a show |
| Days | Back from business trip and it's cracked |
| Years | Wait till you retire |
| Centuries | Dynasty change |
| Eternity | End of the universe, Time itself will perish |

## License

[MIT](LICENSE)

---

## Author

Tzu-Chao - [tznthou@gmail.com](mailto:tznthou@gmail.com)
