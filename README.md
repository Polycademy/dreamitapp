Dream it App
============

Official Site: http://dreamitapp.com

Setup Instructions
------------------

In order to setup Dream it App to be edited and deployed, you must first have a development environment. This is your environment will be on your local computer. First determine what operating you are using. The below instructions are for Windows computers:

1. WampServer (http://www.wampserver.com/en/)
  * Get the WampServer 32 bit & PHP 5.4 & Apache 2.4. This application setups a localhost server on your computer allowing you run the app itself.
  * Once downloaded, you will need to edit the php.ini file in order to activate some extensions. There are 2 php.ini files.The first is located inside (depending on hard drive) `C:\wamp\bin\php\php5.4.16\php.ini` and the second is can be accessed when you launch WampServer and from the toolbar icon, click on the PHP folder and hit php.ini. Both of these files require you to do these edits:
    1. Find `;extension=php_curl.dll` and uncomment this by removing the `;` and resulting in `extension=php_curl.dll`.
    2. Find `;extension=php_openssl.dll` and uncomment this by removing the `;` and resulting in `extension=php_openssl.dll`.
    3. Find `;extension=php_pdo_mysql.dll` and uncomment this by removing the `;` and resulting in `extension=php_pdo_mysql.dll`.
  * If you have Skype installed, make sure to untick "Use port 80 and 443 as alternatives for incoming connections". This is the tools > options > advanced > connection.
  * Keep track of the "www" directory that should be inside `C:\wamp\www\`. This will be where we'll do the majority of our work.
  * Restart your computer and your toolbar icon should be green. If it still not green, you will need someone to check your computer.
  * Make sure to go to the toolbar icon and hit restart all services.
2. Github for Windows (http://windows.github.com/)
  * You must have an account on Github for this work.
  * Once downloaded go into tools > options and login to Github using this application.
  * In the default storage directory, point it to your "www" directory.
  * On the left you should see Polycademy, go into there and clone both dreamitapp repository.
  * This means you now have the full source code of Dream it App inside your "www" directory.
  * If you feel like it, you should fork the repository into your own respository and then make the necessary changes. This requires a more advanced understanding of Git however.
3. Git Binary (http://git-scm.com/download/win)
  * This will install the actual git binary into your computer.
  * This is used to manage repositories, however this is the CLI version, not the GUI version.
  * It will be used on your command line.
4. Curl (http://curl.haxx.se/dlwiz/?type=bin&os=Win32&flav=-&ver=2000%2FXP)
  * This is a CLI utility for downloading and manipulating resources over HTTP.
  * You should use the download wizard to get the correct executable. You want the one that has SSH and SSL enabled.
  * This will give you an archive you must uncompress and store in a place such as `C:\curl`.
5. Node and NPM (http://nodejs.org/)
  * This will install the node runtime environment for running javascript on the server side. It bundles the node package manager for installing third party dependencies.
6. Composer (http://getcomposer.org/download/)
  * This will install Composer, the PHP package manager.
  * Use the Windows installer and go through the instructions to install it.
  * It will ask for the location of the PHP binary. Point it to `C:\wamp\bin\php\php5.4.16\php.exe`.
7. HeidiSQL (http://www.heidisql.com/)
  * This will install a GUI for managing the MySQL database.
8. Ruby & Gem (http://rubyinstaller.org/)
  * This will install the Ruby & Gem runtime environment.
  * This windows installer should install into `C:\Ruby200`.
9. PagodaClient (http://help.pagodabox.com/customer/portal/articles/175474)
  * This will install a CLI app provided by PagodaBox in order to interface with their deployment server.
  * Follow their instructions using `gem` from the Ruby installation in order to install Pagoda.
  * Upon first use of Pagoda, it will ask for your username and password. Make sure these are correct. If they are incorrect, you will need to edit the cache and make them correct in the text file located in: `C:\Users\{Username}\.pagodarc`. This is a hidden file. You will need to make your computer show hidden files inside your control panel > folder options.
10. Notepad++ (http://notepad-plus-plus.org/)
    * This installs a text editor designed for manipulating code.
    * Use this when trying to edit any text files.
11. Redmond Path Editor (http://www.softpedia.com/progDownload/Redmond-Path-Download-94116.html)
  * This will allow us to edit the paths to binary executables on our computer.
  * We must establish these paths so they can accessed from the command line.
  * At the same time, open up your terminal in order to validate that these work. You can use start > run > cmd
  * Paths to be set: [alias] - [path]
    1. php - `C:\wamp\bin\php\php5.4.16`
    2. git - `C:\Program Files (x86)\Git\cmd`
    3. curl - `C:\curl`
    4. composer - `C:\composer` (This may be different as the installer for composer will install where it thinks it should be installed. Just make sure "composer" path exists.
    5. node - `C:\Program Files\nodejs`
    6. npm - `C:\Users\Roger\AppData\Roaming\npm`
    7. ruby - `C:\Ruby200\bin`
    8. gem - This is the same path as ruby.
    9. pagoda - This is the same path as npm.
  * Run those aliases inside your terminal and watch if any results come from it. If they don't find it, then the paths are incorrect.

Configuration Instructions
--------------------------

Before we go any further, we must configure our services to be connected to the deployment server. Currently the server is at PagodaBox.

###Repository Connections

In order to connect to Pagodabox we must set an SSH key between your local computer and the server. This ensures the connection is authorised.

Open up Github for Windows. Go into one of your cloned respositories. Open up tools > open shell here.

Inside the shell generate an SSH key using the instructions at Step 2 in this article: https://help.github.com/articles/generating-ssh-keys#step-2-generate-a-new-ssh-key. Don't bother with any of the other steps.

2 SSH files will be created inside `C:\Users\{Username}\.ssh`. They will match the name of the SSH key that you created.

Open the one with the {nameofssh}.pub extension. Copy the contents.

Log into your Pagodabox account. Hit your name and gear on the top right. This goes into your account settings. Then click add a new ssh key. This will have to be done for each computer you are working from.

Paste the contents into the text area. Also name your key the same name as the name you gave to your key on your local computer. Hit save.

Now you have a public and private key shared between Pagodabox and your local computer.

Now we have to connect our git repositories to the server respositories.

There is a dream it app repository in your "www" folder. This contains the source code, and inside the build folder contains everything that is needed to deploy. From Github for Windows, go into the dreamitapp repo. Hit tools > open shell from here.

You are going to add a new remote repo connecting to the dreamitapp repository. The instructions are in this article: http://help.pagodabox.com/customer/portal/articles/274179 However we will need to skip some instructions.

Write this into your terminal. IMPORTANT: Replace {your-app} with dreamitapp.

```
git remote add pagoda git@git.pagodabox.com:{your-app}.git
```

Now if you make any changes to dreamitapp repo, you can then use this inside the same shell location:

```
git push pagoda --all
```

And this will push the repository to the server. Don't do this just yet, as we don't have code differences.

###Database Connections

To connect HeidiSQL our GUI SQL editor to the hosted database, we must log into PagodaBox.

Go into the admin of your site.

Click on the db1-dreamitapp (it's a hexagonal button in the middle of the screen.

This will drop down a panel showing aspects of the database. Click on show credentials. This will show you the username, password.

Launch your terminal from run > cmd. Inside this write:

```
pagoda tunnel -c db1
```

This will ask you for the name of your application. Write `dreamitapp`.

This should give you an output like this:

```
Tunnel Established!  Accepting connections on :
-----------------------------------------------

HOST : 127.0.0.1 (or localhost)
PORT : 45000
USER : (found in pagodabox dashboard)
PASS : (found in pagodabox dashboard)

-----------------------------------------------
(note : ctrl-c To close this tunnel)
```

Launch HeidiSQL. Create a new session. Inside this session we will put in:

Hostname/IP: 127.0.0.1
User: {enter user}
Password: {enter pass}
Port: 45000

Make sure the port values are the same as the one given in the terminal. Keep the terminal running, do not close it.

Now hit connect. You are now connected to the database and can do anything you want there.

Editing and Deployment Instructions
-----------------------------------

To edit the actual source code. Open up your terminal and use the `cd` commands to navigate to your `www/dreamitapp` directory.

Inside this directory, for the first time run:

```
composer install
```

then

```
npm install
```

then 

```
bower install
```

These will install all the dependencies of the application.

Now we need the secret keys, this is not saved in the remote repository because it is secret. Go into your drop box and grab the `keys.php`. Copy and paste this into `www/dreamitapp/secrets/keys.php`. This houses the secret API keys to the third party services.

You should be able to run the application now. By accessing `http://localhost/dreamitapp`.

Before you start editing, you should pull in any remote changes from Github. These changes can come from projectc collaborators or yourself when you produced a change from another computer. Simply go into the repository and synchronise it in order to pull in the remote changes into your local repository.

Edit what you nee to edit. If you have done your edits. Go to Github for Windows and go into the repository and commit and synchronise your repository.

Once you're done, run this at the root of the directory:

```
grunt
```

This will compile a build version of the source code. You should see a `www/dreamitapp/build` directory.

Open up Github for Windows and commit and synchronise your dreamitapp repository.

Open up the terminal at the root of dreamitapp and run:

```
git push pagoda --all
```

This will ask for your password for the SSH key you set.

Then this will push and deploy code to the production server.

External Services
-----------------

- PagodaBox - Host
- InkFilePicker - File Uploading Abstraction
- Amazon S3 - File Hosting for InkFilePicker
- Facebook - Facebook Login
- Google Analytics - Analytics
- Mandrill - Transactional Email (http://mandrill.com/)
- Share This - Social Sharing (http://http://www.sharethis.com/)