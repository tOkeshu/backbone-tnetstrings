$(document).ready(function() {

    module("Backbone-TNetStrings.sync", {
        setup : function() {
            window.lastRequest = null;
            Backbone.sync = Backbone.TNetStrings.sync

            $.ajax = function(obj) {
                lastRequest = obj;
            };
        }
    });

    var Library = Backbone.Collection.extend({
        url : function() { return '/library'; }
    });

    var library = new Library();

    var attrs = {
        title  : "The Tempest",
        author : "Bill Shakespeare",
        length : 123
    };

    test("sync: read", function() {
        library.fetch();
        equals(lastRequest.url, '/library');
        equals(lastRequest.type, 'GET');
        equals(lastRequest.dataType, 'tnetstrings');
        ok(_.isEmpty(lastRequest.data));
    });

    test("sync: passing data", function() {
        library.fetch({data: {a: 'a', one: 1}});
        equals(lastRequest.url, '/library');
        equals(lastRequest.data.a, 'a');
        equals(lastRequest.data.one, 1);
    });

    test("sync: create", function() {
        library.add(library.create(attrs));
        equals(lastRequest.url, '/library');
        equals(lastRequest.type, 'POST');
        equals(lastRequest.dataType, 'tnetstrings');
        var tnet = tnetstrings.parse(lastRequest.data);
        equals(tnet.value.title, 'The Tempest');
        equals(tnet.value.author, 'Bill Shakespeare');
        equals(tnet.value.length, 123);
        equals(tnet.extra, "");
    });

    test("sync: update", function() {
        library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
        equals(lastRequest.url, '/library/1-the-tempest');
        equals(lastRequest.type, 'PUT');
        equals(lastRequest.dataType, 'tnetstrings');
        var tnet = tnetstrings.parse(lastRequest.data);
        equals(tnet.value.id, '1-the-tempest');
        equals(tnet.value.title, 'The Tempest');
        equals(tnet.value.author, 'William Shakespeare');
        equals(tnet.value.length, 123);
        equals(tnet.extra, "");
    });

    test("sync: update with emulateHTTP and emulateTNetStrings", function() {
        Backbone.emulateHTTP = Backbone.emulateTNetStrings = true;
        library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'POST');
        equals(lastRequest.dataType, 'tnetstrings');
        equals(lastRequest.data._method, 'PUT');
        var tnet = tnetstrings.parse(lastRequest.data.model);
        equals(tnet.value.id, '2-the-tempest');
        equals(tnet.value.author, 'Tim Shakespeare');
        equals(tnet.value.length, 123);
        equals(tnet.extra, "");
        Backbone.emulateHTTP = Backbone.emulateTNetStrings = false;
    });

    test("sync: update with just emulateHTTP", function() {
        Backbone.emulateHTTP = true;
        library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'POST');
        equals(lastRequest.contentType, 'application/tnetstrings');
        var tnet = tnetstrings.parse(lastRequest.data);
        equals(tnet.value.id, '2-the-tempest');
        equals(tnet.value.author, 'Tim Shakespeare');
        equals(tnet.value.length, 123);
        equals(tnet.extra, "");
        Backbone.emulateHTTP = false;
    });

    test("sync: update with just emulateTNetStrings", function() {
        Backbone.emulateTNetStrings = true;
        library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'PUT');
        equals(lastRequest.contentType, 'application/x-www-form-urlencoded');
        var tnet = tnetstrings.parse(lastRequest.data.model);
        equals(tnet.value.id, '2-the-tempest');
        equals(tnet.value.author, 'Tim Shakespeare');
        equals(tnet.value.length, 123);
        equals(tnet.extra, "");
        Backbone.emulateTNetStrings = false;
    });

    test("sync: read model", function() {
        library.first().fetch();
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'GET');
        ok(_.isEmpty(lastRequest.data));
    });

    test("sync: destroy", function() {
        library.first().destroy();
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'DELETE');
        equals(lastRequest.data, null);
    });

    test("sync: destroy with emulateHTTP", function() {
        Backbone.emulateHTTP = Backbone.emulateTNetStrings = true;
        library.first().destroy();
        equals(lastRequest.url, '/library/2-the-tempest');
        equals(lastRequest.type, 'POST');
        equals(tnetstrings.dump(lastRequest.data), '19:7:_method,6:DELETE,}');
        Backbone.emulateHTTP = Backbone.emulateTNetStrings = false;
    });

    test("sync: urlError", function() {
        model = new Backbone.Model();
        raises(function() {
            model.fetch();
        });
        model.fetch({url: '/one/two'});
        equals(lastRequest.url, '/one/two');
    });

    test("sync: parse the TNetStrings response", function() {
        model = new Backbone.Model();
        model.fetch({url: '/one/two'});
        // send {"id": "123", "foo": "bar"} to the model
        lastRequest.success('23:2:id,3:123,3:foo,3:bar,}');
        equals(model.id, '123');
        equals(model.get('foo'), 'bar');
    });

});
