# <p style="text-align:center">Solstice Digital Signage Examples</p>
## <p style="text-align:center">Overview</p>
<p>
Below are instructions for using the examples provided in this repository.
<br>
To deploy one of the examples:
1. First, copy all of the files from the respective example folder before making any changes. This will ensure you have a clean backup to revert to.
2. Then follow the recommended changes listed by example below.
</p>
<p>Also see the (Custom Welcome Screen documentation page to come)[https://documentation.mersive.com/content/pages/admin-custom-welcome-screen.htm].
</p>

## <p style="text-align:center">Example 1 - Business Meeting Room</p>
![Business Example](./readme_images/business_example.png)
<p>
Files:
**index.html** - icon images that appear with the 
</p>
<p>
The Business Meeting Room example is a simple digital signage solution that allows for custom imaging in the background to suit brand standards and also preserves the configured directions for how to connect to the Solstice display for wireless sharing.
</p>

### Manage background images:
**IMPORTANT NOTE: Do not delete or replace transparent_overlay.png**
<p>
The `app.js` web application has the functionality to change between multiple backgrounds at a time interval set by the moderator (admin configuring these files).
<br>
To set the time interval, you must change the variable inside the `app.js` file named `backgroundChangeTimer`. This is currently set to 60,000 milliseconds, which equals 1 minute. Reminder: every 1,000 milliseconds equals 1 second.<br>
</p>
<p>
You can also replace or add to the included background images provided. To do this, you will want to add your images to the img folder.
<br>
</p>

![Image Location](./readme_images/image_location.png)
<br>
<p>
Once you have placed the desired images into the **img** folder, then add the file names to the `app.js`  file. This is done by modifying the `backgroundArray` variable. Ensure the array only contains the names of the files in the img folder that you would like to have displayed as the background.
If you do not wish to have the background images change, simply include a single file name in the array. Below is an example image of the array.
<br>
</p>

![Array Example](./readme_images/array_example.png)


### Manage company logo:
<p>

</p>

## <p style="text-align:center">Example 2 - Message Board</p>
![Messageboard Example](./readme_images/messageboard_example.png)