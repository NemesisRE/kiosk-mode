# kiosk-mode
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![CodeQL](https://github.com/NemesisRE/kiosk-mode/actions/workflows/github-code-scanning/codeql/badge.svg?style=flat-square)](https://github.com/NemesisRE/kiosk-mode/security/code-scanning/tools/CodeQL/status)
[![HACS Action](https://github.com/NemesisRE/kiosk-mode/actions/workflows/hacs.yaml/badge.svg)](https://github.com/NemesisRE/kiosk-mode/actions/workflows/hacs.yaml)
[![Test](https://github.com/NemesisRE/kiosk-mode/actions/workflows/test.yaml/badge.svg)](https://github.com/NemesisRE/kiosk-mode/actions/workflows/test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/NemesisRE/kiosk-mode/badge.svg?branch=master)](https://coveralls.io/github/NemesisRE/kiosk-mode?branch=master)
[![release](https://img.shields.io/github/v/release/NemesisRE/kiosk-mode.svg)](https://github.com/NemesisRE/kiosk-mode/releases)
[![downloads](https://img.shields.io/github/downloads/NemesisRE/kiosk-mode/total)](https://github.com/NemesisRE/kiosk-mode/releases)

[![Home Assistant Nightly Beta Tests](https://github.com/NemesisRE/kiosk-mode/actions/workflows/ha-beta-tests.yaml/badge.svg)](https://github.com/NemesisRE/kiosk-mode/actions/workflows/ha-beta-tests.yaml)

Hides the header and/or sidebar drawer in [Home Assistant](https://www.home-assistant.io/) lovelace dashboards.

![image](example.png)

# Installation

**Follow only one of two installation methods below, HACS or Manually:**

>If you want to learn how to install and set some basic configurations in `kiosk-mode` through a video, check the [next one](https://youtu.be/G3lT4zgjER8) from [@smarthomejunkie](https://github.com/smarthomejunkie).

> [!IMPORTANT]  
> 1. If you have `Home Assistant` `2025.5.1` or greater installed, the minimum compatible version that you can install is `Kiosk Mode` `v7.0.0`. If you are in a lower version of `Home Assistant`, the latest compatible version that you can install is `v6.7.0`.
> 2. If you have `Home Assistant` `2025.10.0` or greater installed, the minimum compatible version that you can install is `Kiosk Mode` `v8.0.0`. If you are in a version of `Home Assistant` between `2025.5.1` and `2025.10.0`, the latest compatible version that you can install is `v7.4.0`.
>3. If you have `Home Assistant` `2026.2.0` or greater installed, the minimum compatible version that you can install is `Kiosk Mode` `v10.0.0`. If you are in a version of `Home Assistant` between `2025.10.0` and `2025.1.3`, the latest compatible version that you can install is `v9.0.2`.

<details>
  <summary><b>Installation through HACS</b></summary>

#### Go to the HACS plugin's page

If you have not disabled the [My Home Assistant](https://www.home-assistant.io/integrations/my/) integration, just click on [this link](https://my.home-assistant.io/redirect/hacs_repository/?owner=NemesisRE&repository=kiosk-mode&category=plugin) to go to the plugin's page, otherwise follow the next steps:

1. Go to `HACS` dashboard
2. Search for `Kiosk Mode` and click on it

#### Install the plugin

1. On the plugin page, click on the `Download` yellow button in the bottom-right corner
2. Click on `Download` in the more-info dialog
3. If you are using `YAML` mode or if `HACS` doesn't automatically add it, you'll need to add the resource manually:

Go to your [configuration.yaml](https://www.home-assistant.io/docs/configuration/) file and add the url of the plugin as an [extra_module_url](https://www.home-assistant.io/integrations/frontend/#extra_module_url):

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/kiosk-mode/kiosk-mode.js
```

<br>
</details>

<details>
  <summary><b>Manual installation</b></summary>
<br>
  
1. Download [kiosk-mode.js](https://github.com/NemesisRE/kiosk-mode/releases/latest) from the latest release and place it in your `www` folder
2. Add the resource:

#### If you are in storage mode (default mode)

1. Go to `Settings > Dashboards`
2. Click on the three dots located on the top-right corner and then click on `Resources`
3. Click on `ADD RESOURCE` on the bottom-right of the screen
4. Add the URL to the file that you have downloaded previously (e.g `/local/kiosk-mode.js?v=1.0.0`)
5. Make sure you add the correct version at the end of the URL (e.g. `?v=1.0.0`) because in this way you make Home Assistant to load the new version instead of a version stored in cache

#### If you are in yaml mode

Go to your [configuration.yaml](https://www.home-assistant.io/docs/configuration/) file and add the url of the plugin as an [extra_module_url](https://www.home-assistant.io/integrations/frontend/#extra_module_url):

```yaml
# You should update the version number at the end of the url
# after every update to avoid the old version being cached by Home Assistant
frontend:
  extra_module_url:
    - /local/kiosk-mode.js?v1.0.0
```

<br>
</details>

<br/>

*If you have trouble installing please [read this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)*

## Important Info

* Since Home Assistant `2023.12.0` it is possible to access the raw config of a "Default dashboard" controlled by Home Assistant. It is important to remark that any configuration that you add to these kinds of dashboards will be ignored so `kiosk-mode` will not be able to read it. You need to create a "New dashboard from scratch" controlled by you to make it work with `kiosk-mode`.
* If you need to disable Kiosk-Mode temporarily add `?disable_km` to the end of your URL.
* Config is placed in the root of your Lovelace config: `kiosk_mode:` should not be indented & is per dashboard.
* If you want the same settings on other dashboards you'll need to repeat the config on those dashboards as well.
* Refresh page after config changes.

## Simple config example

YAML mode users need to add the configuration manually to the lovelace dashboard file in which they want to enable `kiosk-mode`. Non-YAML users (Storage Mode) need to add the configuration to each lovelace panel going to `Edit dashboard` option (pencil icon on the top-right of the screen). Once in `Edit Dashboard` mode, click on the top-right three-dots button and select `Raw configuration editor`.

```yaml
kiosk_mode:
  hide_header: true
  hide_sidebar: '{{ is_state("input_boolean.hide_sidebar", "on") }}'
views:
```
*Note: `views:` is added in the example above to show where `kiosk_mode:` should be placed in your Lovelace config*<br><br>

## Config Options

All the options, excluding `debug_template`, can be set as a boolean and all of them are `false` by default. Excluding `ignore_mobile_settings` and `ignore_disable_km`, all the options can be set as a [JavaScript](#javascript-templates) or a [Jinja](#jinja-templates) template that returns a boolean.

>**Note:** If you set the option as a string but it is not a valid [JavaScript](#javascript-templates) or [Jinja](#jinja-templates) template, the library will throw an error. If you set a `JavaScript` or a `Jinja` template and it doesn't return a boolean, the option will be set as false and a warning will be thrown.

| Config Option                                        | Description |
|:-----------------------------------------------------|:------------|
|`kiosk`                                               | Hides both the header and sidebar. |
|`hide_header`<sup>1</sup>                             | Hides only the header. |
|`hide_sidebar`                                        | Hides only the sidebar. |
|`hide_menubutton`<sup>1</sup>                         | Hides only the sidebar menu icon. |
|`hide_settings`                                       | Hides the settings item. |
|`hide_notifications`                                  | Hides the notifications entry-point. |
|`hide_account`                                        | Hides the account icon. |
|`hide_search`                                         | Hides the search icon. |
|`hide_assistant`                                      | Hides the assistant icon. |
|`hide_overflow`                                       | Hides the top right overflow menu. |
|`block_overflow`                                      | Blocks the top right overflow menu mouse interactions. |
|`hide_refresh`                                        | Hides the "Refresh" button inside the top right overflow menu in lovelace yaml mode. |
|`hide_unused_entities`                                | Hides the "Unused entities" button inside the top right overflow menu in lovelace yaml mode. |
|`hide_reload_resources`                               | Hides the "Reload resources" button inside the top right overflow menu in lovelace yaml mode. |
|`hide_edit_dashboard`                                 | Hides the "Edit dashboard" button inside the top right overflow menu. |
|`hide_add_to_home_assistant`                          | Hides the "Add to Home Assistant" overflow menu |
|`block_mouse`                                         | Blocks completely the mouse. No interaction is allowed and the mouse will not be visible. **Can only be disabled with `?disable_km` query parameter in the URL.**. |
|`block_context_menu`                                  | Prevents opening a right-click context menu (sometimes accessible via tap-and-hold on touchscreen devices).|
|`hide_dialog_header_breadcrumb_navigation`<sup>2</sup>| Hides the breadcrumb navigation over the title of more-info dialogs |
|`hide_dialog_header_history`                          | Hides the "History" icon in the header of more-info dialogs. |
|`hide_dialog_header_settings`<sup>3</sup>             | Hides the "Settings" icon in the header of more-info dialogs. |
|`hide_dialog_header_overflow`<sup>3</sup>             | Hides the top right overflow menu in the header of more-info dialogs. |
|`hide_dialog_header_action_items`                     | Hides all the action items from the header of more-info dialogs. |
|`hide_dialog_history`                                 | Hides the "History" section in the more-info dialogs. |
|`hide_dialog_history_show_more`                       | Hides the "Show more" link in the "History" section of more-info dialogs.  |
|`hide_dialog_logbook`                                 | Hides the "Logbook" section in the more-info dialogs. |
|`hide_dialog_logbook_show_more`                       | Hides the "Show more" link in the "Logbook" section of more-info dialogs. |
|`hide_dialog_media_actions`                           | Hides the actions block in the more-info dialogs of media-player entities. |
|`hide_dialog_update_actions`                          | Hides the actions block in the more-info dialogs of update entities. |
|`hide_dialog_camera_actions`                          | Hides the actions block in the more-info dialogs of camera entities. |
|`hide_dialog_timer_actions`                           | Hides the actions block in the more-info dialogs of timer entities. |
|`hide_dialog_climate_actions`                         | Hides all the actions in the more-info dialogs of climate entities. |
|`hide_dialog_climate_temperature_actions`             | Hides the temperature cotrol actions in the more-info dialogs of climate entities. |
|`hide_dialog_climate_settings_actions`                | Hides the mode and preset actions in the more-info dialogs of climate entities. |
|`hide_dialog_light_actions`                           | Hides all the actions in the more-info dialogs of light entities. |
|`hide_dialog_light_control_actions`                   | Hides the control actions in the more-info dialogs of light entities. |
|`hide_dialog_light_color_actions`                     | Hides the favorite colors actions in the more-info dialogs of light entities. |
|`hide_dialog_light_settings_actions`                  | Hides the settings actions in the more-info dialogs of light entities. |
|`ignore_disable_km`<sup>4</sup>                       | Useful for [conditional configs](#conditional-lovelace-config) and will cause `disable_km` URL parameter to be ignored. |
|`ignore_mobile_settings`<sup>4, 5</sup>               | Useful for [conditional configs](#conditional-lovelace-config) and will cause `mobile_settings` to be ignored. |
|`debug`<sup>6</sup>                                   | Useful for debugging purposes. Check the [debugging section](#debugging). |
|`debug_template`<sup>6</sup>                          | Useful for debugging purposes. Check the [debugging section](#debugging). |

<br/>

><sup>1</sup> Take into account that swipe gesture to open the sidebar was removed from Home Assistant in version 2023.4, if you hide the header or the sidebar menu icon, you will not have any way to access the sidebar natively in a browser.
>
><sup>2</sup> These elements are not clickable if the account is not an admin account.
>
><sup>3</sup> These elements are not visible by default if the account is not an admin account.
>
><sup>4</sup> These options should be booleans. If you try to set them as a [JavaScript](#javascript-templates) or a [Jinja](#jinja-templates) template, an error will be thrown.
>
><sup>5</sup> This option only works if it is placed inside [admin_settings](#admin_settings), [non_admin_settings](#non_admin_settings) or [user_settings](#user_settings). It will not have any effect if it is placed inside [mobile_settings](#mobile_settings).
>
><sup>6</sup> These options will not change anything in the UI. They will log messages in the browser console.

<br/>

## Options through screenshots
<br>

![Lovelace Dashboard](images/lovelace-dashboard.png)
<br>*Lovelace dashboard*
<br>

| Options                      | Hides / Blocks       |
|:-----------------------------|:---------------------|
| `kiosk`                      | 1 and 2              |
| `hide_header`                | 1                    |
| `hide_sidebar`               | 2                    |
| `hide_menubutton`            | 3                    |
| `hide_settings               | 4                    |
| `hide_notifications`         | 5                    |
| `hide_account`               | 6                    |
| `hide_add_to_home_assistant` | 7                    | 
| `hide_search`                | 8                    |
| `hide_assistant`             | 9                    |
| `hide_overflow`              | 10                   |
| `block_overflow`             | 10                   |
| `block_mouse`                | whole interface      |
| `block_context_menu`         | right click anywhere |

<br>

![Lovelace Dashboard](images/overflow-menu.png)
<br>*Overflow menu*
<br>

| Options                 | Hides |
|:------------------------|:------|
| `hide_refresh`          | 11    |
| `hide_unused_entities`  | 12    |
| `hide_reload_resources` | 13    |
| `hide_edit_dashboard`   | 14    |

<br>

![Lovelace Dashboard](images/more-info-dialog-media-entity.png)
<br>*More info dialog (media entity)*
<br>

| Options                                    | Hides |
|:-------------------------------------------|:------|
| `hide_dialog_header_breadcrumb_navigation` | 15    |
| `hide_dialog_header_action_items`          | 16    |
| `hide_dialog_header_history`               | 17    |
| `hide_dialog_header_settings`              | 18    |
| `hide_dialog_header_overflow`              | 19    |
| `hide_dialog_media_actions`                | 20    |
<br>

![Lovelace Dashboard](images/more-info-dialog-climate-entity.png)
<br>*More info dialog (climate entity)*
<br>

| Options                                   | Hides |
|:------------------------------------------|:------|
| `hide_dialog_climate_actions`             | 21    |
| `hide_dialog_climate_temperature_actions` | 22    |
| `hide_dialog_climate_settings_actions`    | 23    |
<br>

![Lovelace Dashboard](images/more-info-dialog-light-entity.png)
<br>*More info dialog (light entity)*
<br>

| Options                                   | Hides |
|:------------------------------------------|:------|
| `hide_dialog_light_actions`               | 24    |
| `hide_dialog_light_control_actions`       | 25    |
| `hide_dialog_light_color_actions`         | 26    |
| `hide_dialog_light_settings_actions`      | 27    |
<br>

![Lovelace Dashboard](images/more-info-dialog-update-entity.png)
<br>*More info dialog (update entity)*
<br>

| Options                      | Hides |
|:-----------------------------|:------|
| `hide_dialog_update_actions` | 28    |
<br>

![Lovelace Dashboard](images/more-info-dialog-timer-entity.png)
<br>*More info dialog (timer entity)*
<br>

| Options                      | Hides |
|:-----------------------------|:------|
| `hide_dialog_timer_actions`  | 29    |
<br>

![Lovelace Dashboard](images/more-info-dialog-history-logbook-attributes.png)
<br>*More info dialog (sensor entity)*
<br>

| Options                         | Hides |
|:--------------------------------|:------|
| `hide_dialog_history`           | 30    |
| `hide_dialog_logbook`           | 31    |
| `hide_dialog_history_show_more` | 32    |
| `hide_dialog_logbook_show_more` | 33    |

<br>

## Templates in options

Most of the config options admit templates. `kiosk-mode` admits two templating systems, [JavaScript templates](#javascript-templates) or [Jinja templates](#jinja-templates). `JavaScript` templates are processed faster because the rendering is done in client side, `Jinja` templates need to perform a [websocket call] to receive the template result, but in general you should not notice many differences between the two in terms of performance. The main difference between the two templating systems (apart from the syntax) is that `JavaScript` can access client side data like DOM APIs meanwhile `Jinja` templates are almost agnostic to the device in which `Home Assistant` is being executed.

>**Note:** Regardless of the template system that you use, remember that the template must return a `boolean`, if it doesn't return a boolean it will be ignored.

### JavaScript templates

This templating system IS NOT [the same that Home Assistant implements](https://www.home-assistant.io/docs/configuration/templating). It is basically a `JavaScript` code block in which you can use certain client-side objects, variables and methods. To set a property as a `JavaScript` template block, include the code between three square brackets `[[[ JavaScript code ]]]`. If you don‘t use the square brackets, then you will receive an error because the string will not be recognise as a template.

The `JavaScript` code will be taken as something that you want to return, but if you have a more complex logic, you can create your own variables and return the desired result at the end.

The entities and domains used in the templates will be stored, so if the state of these entities change, it will update the templates used in the options.

#### JavaScript templates example

```yaml
kiosk_mode:
  hide_header: '[[[ user_name === "ElChiniNet" ]]]'
  hide_sidebar: '[[[ is_state("input_boolean.hide_sidebar", "on") ]]]'
```

>Note: `kiosk-mode` uses [Home Assistant Javascript Templates] for the `JavaScript` templating system. To know all the objects, variables and methods available in the `JavaScript` templates, consult the [proper section](https://github.com/elchininet/home-assistant-javascript-templates?tab=readme-ov-file#objects-and-methods-available-in-the-templates) in the repository.

### Jinja templates

This templating system is [the same that Home Assistant implements](https://www.home-assistant.io/docs/configuration/templating). You can use the majority of the template methods and objects. The entire template will be processed, rendered and the result will be used in the desired option. `Jinja templates` don't have access to client side variables or DOM APIs, but the next client side variables will be available:

* `user_name`: String with the logged user's name
* `user_is_admin`: Bolean value than indicates if the logged user is admin or not
* `user_is_owner`: Bolean value than indicates if the logged user is the owner or not
* `user_agent`: User agent of the browser in which Home Assistant is being executed

#### Jinja templates example

```yaml
kiosk_mode:
  hide_header: '{{ user_name == "ElChiniNet" }}'
  hide_sidebar: '{{ is_state("input_boolean.hide_sidebar", "on") }}'
```

### Simplify your templates

Using templates for the options gives a lot of flexibility and depending on your objectives you can omit the usage of the [conditional configs](#conditional-lovelace-config), so when you start to create conditional configurations, ask yourself if it can be achieved with templates. For example:

```yaml
kiosk_mode:
  hide_sidebar: false
  hide_header: false
  user_settings:
    - users:
      - "ryan meek"
      - "maykar"
      hide_header: true
  non_admin_settings:
    hide_sidebar: true
```

Can be transformed into a simpler version:

```yaml
kiosk_mode:
  hide_header: '{{ user_name in ("maykar", "ryan meek") }}'
  hide_sidebar: '[[[ !user_is_admin ]]]'
```

Both options are valid. At the end, using one or the other is up to you.

<br>

## Conditional Lovelace Config
Contitional configs take priority and if a condition matches all other config options/methods are ignored.
These use the same options as above, but placed under one of the following user/entity conditions:<br><br>

### admin_settings:
Sets the config for every admin user.<br>
*Overwritten by user_settings and mobile_settings ( unless `ignore_mobile_settings` is used ).*<br>

```
kiosk_mode:
  admin_settings:
    hide_header: true
```
<br>

### non_admin_settings:
Sets the config for every regular user.<br>
*Overwritten by user_settings and mobile_settings ( unless `ignore_mobile_settings` is used ).*<br>

```
kiosk_mode:
  non_admin_settings:
    hide_header: true
```
<br>

### user_settings:
Sets the config for specific users. **This uses a user's name, not their username (if they're different)**.<br>
*Overwritten by mobile_settings ( unless `ignore_mobile_settings` is used ).*<br>

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
```
<br>

### mobile_settings:
Sets the config for mobile devices. The default breakpoint is `812px`, which can be changed by setting the `custom_width` option.<br>

```
kiosk_mode:
  mobile_settings:
    hide_header: true
    custom_width: 768
```
<br>

## Query Strings
Add a query string such as `?kiosk` to the end of your URL:

```
https://hass:8123/lovelace/default_view?kiosk
```

If you need to add multiple query parameters, you need to separate them by `&` (only the first parameter should be prepended by `?`):

```
https://hass:8123/lovelace/default_view?hide_header&hide_sidebar
```

The query string options are:

* `?kiosk` to hide both header and sidebar
* `?hide_header` to hide only the header
* `?hide_sidebar` to hide only the sidebar
* `?hide_menubutton` to hide sidebar menu button
* `?hide_settings` to hide the settings item
* `?hide_notifications` to hide the notifications entry-point
* `?hide_account` to hide the account icon
* `?hide_add_to_home_assistant` to hide the "Add to Home Assistant" overflow
* `?hide_search` to hide the search icon
* `?hide_assistant` to hide the assistant icon
* `?hide_overflow` to hide the top right menu
* `?block_overflow` to block the top right overflow menu mouse interactions
* `?hide_refresh` to hide the "Refresh" button inside the top right menu in lovelace yaml mode
* `?hide_unused_entities` to hide the "Unused entities" button inside the top right menu in lovelace yaml mode
* `?hide_reload_resources` to hide the "Reload resources" button inside the top right menu in lovelace yaml mode
* `?hide_edit_dashboard` to hide the "Edit dashboard" button inside the top right menu
* `?block_mouse` to block completely the mouse
* `?block_context_menu` to prevent opening a right-click context menu
* `?hide_dialog_header_breadcrumb_navigation` to hide the breadcrumb navigation over the title of more-info dialogs
* `?hide_dialog_header_history` to hide the "History" icon in the header of more-info dialogs
* `?hide_dialog_header_settings` to hide the "Settings" icon in the header of more-info dialogs
* `?hide_dialog_header_overflow` to hide the top right overflow menu in the header of more-info dialogs
* `?hide_dialog_header_action_items` to hide all the action items from the header of more-info dialogs.
* `?hide_dialog_history` to hide the "History" section in the more-info dialogs
* `?hide_dialog_history_show_more` to hide the "Show more" link in the "History" section of more-info dialogs
* `?hide_dialog_logbook` to hide the "Logbook" section in the more-info dialogs
* `?hide_dialog_logbook_show_more` to hide the "Show more" link in the "Logbook" section of more-info dialogs
* `?hide_dialog_media_actions` to hide the actions block in the more-info dialogs of media-player entities
* `?hide_dialog_update_actions` to hide the actions block in the more-info dialogs of update entities
* `?hide_dialog_camera_actions` to hide the actions block in the more-info dialogs of camera entities
* `?hide_dialog_timer_actions` to hide the actions block in the more-info dialogs of timer entities
* `?hide_dialog_climate_actions` to hide all the actions in the more-info dialogs of climate entities
* `?hide_dialog_climate_temperature_actions` to hide the temperature cotrol actions in the more-info dialogs of climate entities
* `?hide_dialog_climate_settings_actions` to hide the mode and preset actions in the more-info dialogs of climate entities
* `?hide_dialog_light_actions` to hide all the actions in the more-info dialogs of light entities
* `?hide_dialog_light_control_actions` to hide the control actions in the more-info dialogs of light entities
* `?hide_dialog_light_color_actions` to hide the favorite colors actions in the more-info dialogs of light entities
* `?hide_dialog_light_settings_actions` to hide the settings actions in the more-info dialogs of light entities



## Query String Caching

You save settings in a devices cache by using the cache keyword once on the device.<br>This will also make it so the options work on all views and dashboards.

Example: `?hide_header&cache` makes all views & dashboards hide the header.<br>
This works for all query strings except for the utility strings listed below.

>**Note:** Do not use the query string cache if you are using Jinja templates for the options or you will get weird results.

**Utility Query Strings**

* `?clear_km_cache` will clear all cached preferences
* `?disable_km` will temporarily disable any modifications (unless `ignore_disable_km` has been used in one of the [conditional configs](#conditional-lovelace-config))
<br>

## Debugging

`Kiosk-mode` counts with two debugging options and each one has a different purpose:

| Option | Description |
| ------ | ----------- |
| `debug` | Prints useful information in the console. The raw config loaded from the Lovelace panel, the resulting final config with all the options, and if a template is rendered, it will print the option that trigered the template, the template code and the evaluated result of it. |
| `debug_template` | Useful to debug the result of a single template without activating the `debug` mode. |

<br>

## Kiosk-mode demo

* Make sure you have [git](https://git-scm.com/downloads) installed
* Make sure you have [pnpm](https://pnpm.io/installation) installed
* Make sure you have Docker installed ([Docker Desktop](https://www.docker.com/products/docker-desktop/) is a quick option)
* Clone the repository `git clone https://github.com/NemesisRE/kiosk-mode.git` (or [download it in a zip file](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives))
* Run `Docker Desktop` so you get `docker daemon` running
* Enter in the repository folder
* Run `pnpm install`
* Run `pnpm demo` (`pnpm demo:win` on Windows environments)
* Open http://localhost:8123/

## Kiosk-mode complements

Some features are outside `kiosk-mode` scope and they would be hard to maintain and escalate over time, but they could be achieved by alternative methods. Check [kiosk-mode complements](KIOSK-MODE-COMPLEMENTS.md) for this.

### Related

* [Fully Kiosk Browser](https://www.fully-kiosk.com/) - Great for wall mounted tablets
* [KTibow/fullscreen-card](https://github.com/KTibow/fullscreen-card) - Make your Home Assistant browser fullscreen
<br>

### Credit
This was originally based on and inspired by [ciotlosm's kiosk mode gist](https://gist.github.com/ciotlosm/1f09b330aa5bd5ea87b59f33609cc931) and [corrafig's fork](https://gist.github.com/corrafig/c8288df960e7f59e82c12d14de26fde8) of the same gist.

Big thank you to [matt8707](https://github.com/matt8707) for starting this project, allowing me to rewrite it, and transfering ownership.

Many thanks to [KTibow](https://github.com/KTibow) as well, for the github release action and support.

And another big thanks to [maykar](https://github.com/maykar) for the original kiosk mode

[Home Assistant Javascript Templates]: https://github.com/elchininet/home-assistant-javascript-templates
[websocket call]: https://developers.home-assistant.io/docs/api/websocket