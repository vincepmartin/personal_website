If you want to use this thing you will have probably do the following.
- Alter the `/themes/hugo-coder/assets/scss_base.scss` file so that the % of the font in html is ~31.25%.
- run `hugo server -D` to double check it renders ok.
- run `hugo` to make a final build when you are OK with it.
- use `deploy.sh` to push the changes to your server.
