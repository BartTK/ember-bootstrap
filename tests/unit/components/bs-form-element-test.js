import {
    moduleForComponent,
        test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('bs-form-element', 'BsFormElementComponent', {
    // specify the other units that are required for this test
    needs: [
        'template:components/form-element/vertical/default',
        'template:components/form-element/vertical/checkbox',
        'template:components/form-element/horizontal/default',
        'template:components/form-element/horizontal/checkbox',
        'template:components/form-element/inline/default',
        'template:components/form-element/inline/checkbox',
        'template:components/form-element/errors',
        'template:components/form-element/feedback-icon',
        'component:bs-input'
    ]
});

test('it renders', function() {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, 'preRender');

    // appends the component to the page
    this.append();
    equal(component._state, 'inDOM');
});


test('component has form-group bootstrap class', function() {
    var component = this.subject();
    equal(component.get('classNames').contains('form-group'), true, 'component has form-group class');
});

test('setting label property displays label tag', function() {
    var component = this.subject({
        label: 'myLabel'
    });
    equal(this.$().find('label').length, 1, 'component has label tag');
    equal(this.$().find('label').text().trim(), 'myLabel', 'label has text');
});

function controlTypeSupportTest(controlType, selector, values, getValueFn) {
    var component = this.subject({
            controlType: controlType
        }),
        control = this.$().find(selector);

    if (!Ember.isArray(values)) {
        values = [values];
    }

    equal(control.length, 1, 'component has ' + controlType + ' control');

    values.forEach(function(value) {
        Ember.run(component, 'set', 'value', value);
        var hasValue = typeof getValueFn === 'function' ? getValueFn.call(control) : control.val();
        equal(hasValue, value, controlType + ' control has correct values');
    });
}

test('controlType "text" is supported', function() {
    controlTypeSupportTest.call(this, 'text', 'input[type=text]', 'myValue');
});

test('controlType "checkbox" is supported', function() {
    controlTypeSupportTest.call(this, 'checkbox', 'input[type=checkbox]', [true, false], function(){ return this.is(':checked'); });
});