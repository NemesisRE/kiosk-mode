# kiosk-mode
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Hides the header and/or sidebar drawer in [Home Assistant](https://www.home-assistant.io/)

![image](example.png)

# Installation

**Follow only one of two installation methods below, HACS or Manually:**

<details>
  <summary><b>Installation and tracking with HACS</b></summary>
<br>

* In the "Frontend" section of [HACS](https://github.com/hacs/integration) hit the plus icon in the bottom right
* Search for `Kiosk Mode` and install it
* If using YAML mode or if HACS doesn't automatically add it you'll need to add the resource below

YAML mode users will add it to their [configuration.yaml](https://www.home-assistant.io/lovelace/dashboards-and-views/#adding-more-dashboards-with-yaml) file.
Non-YAML mode, or Storage Mode, users can find resources in their sidebar under `"Configuration" > "Lovelace Dashboards" > "Resources"`

```yaml
resources:
  - url: /hacsfiles/kiosk-mode/kiosk-mode.js
    type: module
```
<br>
</details>

<details>
  <summary><b>Manual installation</b></summary>
<br>
  
* Download [kiosk-mode.js](https://github.com/NemesisRE/kiosk-mode/releases/latest) from the latest release and place it in your `www` folder
* Add the resource below

YAML mode users add it to their [configuration.yaml](https://www.home-assistant.io/lovelace/dashboards-and-views/#adding-more-dashboards-with-yaml) file.
Non-YAML mode, or Storage Mode, users can find resources in their sidebar under `"Configuration" > "Lovelace Dashboards" > "Resources"`

```yaml
resources:
  # You'll need to update the version number at the end of the url after every update.
  - url: /local/kiosk-mode.js?v=1.2.1
    type: module
```
<br>
</details>

*If you have trouble installing please [read this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)*

## Important Info

* If you need to disable Kiosk-Mode temporarily add `?disable_km` to the end of your URL.
* Config is placed in the root of your Lovelace config: `kiosk_mode:` should not be indented & is per dashboard.
* If you want the same settings on other dashboards you'll need to repeat the config on those dashboards as well.
* Refresh page after config changes.

## Config Options

| Config Option            | Type    | Default | Description |
|:-------------------------|:--------|:--------|:------------|
|`kiosk:`                  | Boolean | false   | Hides both the header and sidebar. |
|`hide_header:`            | Boolean | false   | Hides only the header. |
|`hide_sidebar:`           | Boolean | false   | Hides only the sidebar. Disables swipe to open. |
|`hide_menubutton:`        | Boolean | false   | Hides only the sidebar menu icon. Does not disable swipe to open. |
|`hide_overflow:`          | Boolean | false   | Hides the top right menu. |
|`hide_account:`           | Boolean | false   | Hides the account icon. |
|`hide_search:`            | Boolean | false   | Hides the search icon. |
|`hide_assistant:`         | Boolean | false   | Hides the assistant icon. |
|`hide_edit_dashboard`     | Boolean | false   | Hides the "Edit dashboard" button inside the top right menu |
|`hide_refresh`            | Boolean | false   | Hides the "Refresh" button inside the top right menu in lovelace yaml mode |
|`hide_unused_entities`    | Boolean | false   | Hides the "Unused entities" button inside the top right menu in lovelace yaml mode |
|`hide_reload_resources`   | Boolean | false   | Hides the "Reload resources" button inside the top right menu in lovelace yaml mode |
|`block_mouse:`            | Boolean | false   | Blocks completely the mouse. No interaction is allowed and the mouse will not be visible. **Can only be disabled with `?disable_km` query parameter in the URL.** |
|`ignore_entity_settings:` | Boolean | false   | Useful for [conditional configs](#conditional-lovelace-config) and will cause `entity_settings` to be ignored. |
|`ignore_mobile_settings:` | Boolean | false   | Useful for [conditional configs](#conditional-lovelace-config) and will cause `mobile_settings` to be ignored. |

## Simple config example

```
kiosk_mode:
  hide_header: true
  
views:
```
*Note: `views:` is added in the example above to show where `kiosk_mode:` should be placed in your Lovelace config*<br><br>

## Conditional Lovelace Config
Contitional configs take priority and if a condition matches all other config options/methods are ignored.
These use the same options as above, but placed under one of the following user/entity conditions:<br><br>

### admin_settings:
Sets the config for every admin user.<br>
*Overwritten by user_settings, mobile_settings, and entity_settings ( unless one of the ignore options is used ).*<br>

```
kiosk_mode:
  admin_settings:
    hide_header: true
```
<br>

### non_admin_settings:
Sets the config for every regular user.<br>
*Overwritten by user_settings, mobile_settings, and entity_settings ( unless one of the ignore options is used ).*<br>

```
kiosk_mode:
  non_admin_settings:
    hide_header: true
    ignore_entity_settings: true
```
<br>

### user_settings:
Sets the config for specific users. **This uses a user's name, not their username (if they're different)**.<br>
*Overwritten by mobile_settings, and entity_settings ( unless one of the ignore options is used ).*<br>

```
kiosk_mode:
  user_settings:
    - users:
        - "ryan meek"
        - "maykar"
      hide_sidebar: true
    - users:
        - "the wife"
      kiosk: true
      ignore_entity_settings: true
```
<br>

### mobile_settings:
Sets the config for mobile devices. The default breakpoint is 812px, which can be changed by setting the `custom_width` option.<br>
*Overwritten by entity_settings, unless `ignore_entity_settings` is used, can be ignored with `ignore_mobile_settings`.*<br>

```
kiosk_mode:
  mobile_settings:
    hide_header: true
    ignore_entity_settings: true
    custom_width: 768
```
<br>

### entity_settings:
Dynamically change config on any entity's state. Under `entity:` list the entity followed by the state that will enable the config below. For more complex logic use this with a template sensor.<br>
*Takes priority over all other config settings unless they use `ignore_entity_settings`.*<br><br>

*Any condition that doesn't match will then fall back to previous configurations if another "false" entity condition hasn't also been set (see the 2nd example).*
```
kiosk_mode:
  entity_settings:
    - entity:
        input_boolean.hide_sidebar: 'on'
      hide_sidebar: true
    - entity:
        sensor.hide_header: 'on'
      hide_header: true
    - entity:
        input_text.kiosk: 'true'
      kiosk: true
```

```
kiosk_mode:
  entity_settings:
    # hide_sidebar has both true and false conditions to be a true override.
    - entity:
        input_boolean.hide_sidebar: 'on'
      hide_sidebar: true
    - entity:
        input_boolean.hide_sidebar: 'off'
      hide_sidebar: false
```
<br>

## Query Strings
Add a query string such as `?kiosk` to the end of your URL:

```
https://hass:8123/lovelace/default_view?kiosk
```

The query string options are:

* `?kiosk` to hide both header and sidebar
* `?hide_header` to hide only the header
* `?hide_sidebar` to hide only the sidebar
* `?hide_overflow` to hide the top right menu
* `?hide_menubutton` to hide sidebar menu button
* `?hide_account` to hide the account icon
* `?hide_search` to hide the search icon
* `?hide_assistant` to hide the assistant icon
* `?hide_edit_dashboard` to hide the "Edit dashboard" button inside the top right menu
* `?hide_refresh` to hide the "Refresh" button inside the top right menu in lovelace yaml mode
* `?hide_unused_entities` to hide the "Unused entities" button inside the top right menu in lovelace yaml mode
* `?hide_reload_resources` to the "Reload resources" button inside the top right menu in lovelace yaml mode
* `?block_mouse` to block completely the mouse

## Query String Caching

You save settings in a devices cache by using the cache keyword once on the device.<br>This will also make it so the options work on all views and dashboards.

Example: `?hide_header&cache` makes all views & dashboards hide the header.<br>
This works for all query strings except for the utility strings listed below.

**Utility Query Strings**

* `?clear_km_cache` will clear all cached preferences
* `?disable_km` will temporarily disable any modifications
<br>

### Related

* [Fully Kiosk Browser](https://www.fully-kiosk.com/) - Great for wall mounted tablets
* [Applicationize](https://applicationize.me/) - Convert web apps into desktop apps
* [KTibow/fullscreen-card](https://github.com/KTibow/fullscreen-card) - Make your Home Assistant browser fullscreen
<br>

### Credit
This was originally based on and inspired by [ciotlosm's kiosk mode gist](https://gist.github.com/ciotlosm/1f09b330aa5bd5ea87b59f33609cc931) and [corrafig's fork](https://gist.github.com/corrafig/c8288df960e7f59e82c12d14de26fde8) of the same gist.

Big thank you to [matt8707](https://github.com/matt8707) for starting this project, allowing me to rewrite it, and transfering ownership.

Many thanks to [KTibow](https://github.com/KTibow) as well, for the github release action and support.

And another big thanks to [maykar](https://github.com/maykar) for the original kiosk mode