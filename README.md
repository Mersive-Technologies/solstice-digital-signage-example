# Solstice Dynamic Digital Signage Examples
## Repository Overview
<p>In Solstice 5.5.2 and higher, Solstice digital signage functionality can be configured to display a customized welcome screen page when the Solstice display is not in use for content sharing. This repository contains examples of some ways this functionality can be used. See directions for using these examples to create dynamic digital signage with Solstice at https://documentation.mersive.com/content/topics/integration-dynamic-digital-signage.htm.
</p>
<p>
Information is provided below about the examples provided in this repository. These examples are provided as is, and a strong understanding of HTML, CSS, JavaScript, graphics, and web server configuration is recommended for any significant modifications.
</p>

## Example 1 - Business Meeting Room
<p>
The Business Meeting Room example is a simple digital signage solution with custom imaging in the background to suit brand standards and directions for how to connect to the Solstice display for wireless content sharing.
</p>

![Business Example](./readme_images/business_example.png)

<p>Files in this example:
<br>- index.html - HTML file that references app.js and styles.css to create the page layout
<br>- app.js - JavaScript programming with variables to interact with Solstice and change between multiple backgrounds at a time interval (example set to 60,000 milliseconds, or 1 minute)
<br>- style.css - Cascading Style Sheet to define colors, spacing, and text attributes
<br>- icons/ - folder for various icons and logos used in the example
<br>- img/ - folder for background images used in example **IMPORTANT NOTE: Do not delete or replace transparent_overlay.png**
</p>

### Example background image array
<p>To add background images to the array:
<br>1. Replace and/or add images to img/ folder.
<br>2. Add the names of all background images to be rorated through to the `backgroundArray` variable.
</p>

![Array Example](./readme_images/array_example.png)


## Example 2 - Message Board
<p>
The Message Board example displays a split screen with informational text messages on one side and a QR code with custom directions for connecting with the Solstice screen key on the other.
</p>

![Messageboard Example](./readme_images/messageboard_example.png)

<p>Files in this example:
<br>- index.html - HTML file that references app.js and styles.css to create the page layout
<br>- app.js - JavaScript programming with ticker function and variables for Solstice display, organization, and messages
<br>- style.css - Cascading Style Sheet to define colors, spacing, and text attributes
<br>- images/ - folder for footer and QR code images
</p>
