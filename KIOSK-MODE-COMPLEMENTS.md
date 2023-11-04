# kiosk-mode complements

Some features are outside `kiosk-mode` scope and they would be hard to maintain and escalate over time, but they could be achieved by alternative methods. This document contains community-driven solutions to achieve things that cannot be done with `kiosk-mode` but could be a complement for Home Assistan instances using this plugin.

### Cards

`kiosk-mode` do not modify cards. Mainly because the layout of a lovelace dashboard could have infinite possibilities and it depends on how the user has built it, it is not a fixed layout as the UI of Home Assistant. On top of that, cards change constantly and there are tons of custom-made cards, it will be impossible to maintain and escalate a code that tries to modify whatever card users have in their dashboards. This section contains multiple modifications that you can achieve on cards.


#### Hide more-info button on some native Home Assistant cards

This method uses [card-mod] to hide the `more-info` button located in the top-right corner of some native Home Assistant cards. This button opens a more-info dialog once it is pressed.

![more-info button](images/kiosk-mode-complements/cards/more-info-button.png)

```yaml
type: light
entity: light.eetkamer_lamp
card_mod:
  ## Hide more-info button
  style: |
    ha-icon-button.more-info {
      display: none;
    }
```

#### Hide different elements in native climate-entities Home Assistant cards

This method uses [card-mod] to hide different elements inside native climate entities Home Assistant cards.

![climate entities elements](images/kiosk-mode-complements/cards/climate-entities-card-elements.png)

```yaml
type: thermostat
entity: climate.thermostat
name: Woonkamer
card_mod:
  style:
    ## hide temperature slider
    round-slider$: |
      .slider {
        pointer-events: none;
      }
      .handles {
        display: none
      }
    ## hide buttons
    '#info': |
      #modes {
        display: none;
      }
```

[card-mod]: https://github.com/thomasloven/lovelace-card-mod