Backbone-TNetStrings
====================

Backbone-TNetStrings is a TNetStrings adapter for Backbone.

If you don't know about TNetStrings, learn more at
[tnetstrings.org](http://tnetstrings.org).

Usage
-----

Include Backbone-TNetStrings after having included `Backbone.js` and
`tnetstrings.js`:

    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="tnetstrings.js"></script>
    <script type="text/javascript" src="backbone-tnetstrings.js"></script>


Override the default Backbone.sync method:

    Backbone.sync = Backbone.TNetStrings.sync

or, for more punctual situations, create your models like so:

    var MyModel = Backbone.Model.extend({
        "sync": Backbone.TNetStrings.sync
    });

Dependencies
------------

  - [Backbone.js](http://documentcloud.github.com/backbone/)
  - [tnetstrings.js](https://github.com/piranha/tnetstrings.js)


LICENSE
-------

The MIT License

Copyright © 2011 Romain Gauthier <romain.gauthier@monkeypatch.me>

