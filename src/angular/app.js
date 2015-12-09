/*
An example from https://github.com/johnpapa/angular-styleguide#style-y092 to illustrate the annotation functionality
*/

angular
    .module('app')
    .controller('AvengersController', AvengersController);

/* @ngInject */
function AvengersController(storage, avengerService) {
    var vm = this;
    vm.heroSearch = '';
    vm.storeHero = storeHero;

    function storeHero() {
        var hero = avengerService.find(vm.heroSearch);
        storage.save(hero.name, hero);
    }
}
