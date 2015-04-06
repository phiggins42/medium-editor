/*global MediumEditor, describe, it, expect, spyOn */

describe('Util', function () {
    'use strict';

    describe('Exposure', function () {

        it("is exposed on the MediumEditor ctor", function () {
            expect(MediumEditor.util).toBeTruthy();
            // dosn't apply now because never exposed as a global
            // expect(MediumEditor.util).toEqual(Util);
        });

    });

    describe('Deprecated', function () {
        it('should warn when a method is deprecated', function () {
            // IE9 mock for SauceLabs
            if (window.console === undefined) {
                window.console = {
                    warn: function (msg) {
                        return msg;
                    }
                };
            }
            var testObj = {
                newMethod: function () {}
            };
            spyOn(testObj, 'newMethod').and.callThrough();
            spyOn(window.console, 'warn').and.callThrough();
            MediumEditor.util.deprecatedMethod.call(testObj, 'test', 'newMethod', ['arg1', true]);
            expect(testObj.newMethod).toHaveBeenCalledWith('arg1', true);
            expect(window.console.warn).toHaveBeenCalledWith(
                'test is deprecated and will be removed, please use newMethod instead'
            );
        });
    });
});

