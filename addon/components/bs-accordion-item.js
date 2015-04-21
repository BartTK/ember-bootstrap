import Ember from 'ember';
import TypeClass from 'ember-bootstrap/mixins/type-class';
import SubComponent from 'ember-bootstrap/mixins/sub-component';

export default Ember.Component.extend(TypeClass, SubComponent, {
    classNames: ['panel'],

    /**
     * @property classTypePrefix
     * @type String
     * @default 'panel'
     * @protected
     */
    classTypePrefix: 'panel',

    type: 'default',

    active: false,

    title: null,

    value: Ember.computed.oneWay('elementId'),

    collapse: Ember.computed.not('transitioning'),
    collapsing: Ember.computed.alias('transitioning'),
    in: Ember.computed.and('collapse','active'),
    collapsed: Ember.computed.not('active'),
    transitioning: false,
    collapseHeight: null,
    collapseStyle: Ember.computed('collapseHeight', function(){
        var height = this.get('collapseHeight');
        return height !== null ? Ember.String.htmlSafe('height: %@px'.fmt(height)) : null;
    }),

    selected: Ember.computed.alias('parentView.selected'),

    action: 'selected',


    show: function() {
        var collapseElement = this.$().find('.panel-collapse');
        var complete = function () {
            this.setProperties({
                transitioning: false,
                collapseHeight: null
            });
        };

        this.setProperties({
            transitioning: true,
            collapseHeight: 0,
            active: true
        });

        if (!Ember.$.support.transition) {
            return complete.call(this);
        }

        collapseElement
            .one('bsTransitionEnd', Ember.run.bind(this, complete))
            // @todo: make duration configurable
            .emulateTransitionEnd(350)
        ;

        Ember.run.next(this, function(){
            this.set('collapseHeight', collapseElement[0].scrollHeight);
        });
    },

    hide: function() {

        var collapseElement = this.$().find('.panel-collapse');
        var complete = function () {
            this.setProperties({
                transitioning: false,
                collapseHeight: null
            });
        };

        this.setProperties({
            transitioning: true,
            collapseHeight: collapseElement[0].offsetHeight,
            active: false
        });

        if (!Ember.$.support.transition) {
            return complete.call(this);
        }

        collapseElement
            .one('bsTransitionEnd', Ember.run.bind(this, complete))
            // @todo: make duration configurable
            .emulateTransitionEnd(350)
        ;

        Ember.run.next(this, function(){
            this.set('collapseHeight', 0);
        });
    },

    actions: {
        toggleActive: function() {
            var value = this.get('value'),
                previous = this.get('selected'),
                active = this.get('active');
            if (!active) {
                this.set('selected', value);
                this.sendAction('action', value, previous);
            }
            else {
                this.set('selected', null);
                this.sendAction('action', null, previous);
            }
        }
    },

    _onSelectedChange: Ember.observer('selected', function() {
        var selected = this.get('selected'),
            value = this.get('value'),
            active = this.get('active');
        if (selected === value && !active) {
            this.show();
        }
        else if (active) {
            this.hide();
        }
    }),
    _onInit: Ember.on('init', function(){
        if (this.get('selected') === this.get('value')) {
            this.set('active', true);
        }
    })


});
