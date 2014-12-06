TH = TH || {};
TH.MainPlayer = (function() {
    function MainPlayer(image, params) {
        var self = this;

        this.shape = new createjs.Bitmap(image.src);
        TH.global.extend.call(this.shape, params);

        this.trees = 2;
        this.country = null;
    }
    MainPlayer.prototype = Object.create(TH.Player.prototype);
    MainPlayer.prototype.constructor = MainPlayer;


    MainPlayer.prototype.zoneClickAction = function() {
        if (!this.trees) {
            TH.ui.components.question.show();
            return false;
        }
        this.decrementTrees();
        return true;
    };
    MainPlayer.prototype.decrementTrees = function() {
        this.trees--;
    };
    MainPlayer.prototype.incrementTrees = function() {
        this.trees++;
    };

    return MainPlayer;
}());