define(function (require) {
    var ListAction = require('ub-ria/ListAction');
    var <%-: actionType %> = require('<%- entity %>/<%- actionModule %>');

    describe('<%-: actionType %>Action', function () {
        it('should be a constructor', function () {
            expect(<%-: actionType %>).toBeOfType('function');
        });

        it('should be instaitable', function () {
            expect(new <%-: actionType %>()).toBeOfType('object');
        });

        it('should extends ListAction', function () {
            var action = new <%-: actionType %>();
            expect(action instanceof ListAction).toBe(true);
        });
    });
});
