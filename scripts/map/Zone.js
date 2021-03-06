TH = TH || {};
TH.Zone = (function() {
    var maxHealth = 3;


    function Zone(id, shape, params) {
        var self = this;
        TH.global.extend.call(shape, params);
        this.id = id;
        this.shape = shape;
        this.health = 0;

        _setupNotifier.call(this);

        this.shape.addEventListener('click', function() {
            var player;

            player = self.country.player;

            if (player && player.zoneClickAction()) {
                self.setFullHealth();
                self.sendZoneData(function(data) {
                    TH.ui.updateComponents({pollution: data.pollution});
                    player.checkHasWon();
                });
            }

        });

        this.shape.on('mouseover', function() {
            var player;

            player = self.country.player;

            if (player && player.zoneHoverAction()) {
                $('body').addClass('tree-cursor');
            } else {
                $('body').removeClass('tree-cursor');
            }
        });
    }
    function _setupNotifier() {
        var bounds = this.shape.getBounds(),
            posX = Math.floor(this.shape.x + bounds.width / 2),
            posY = Math.floor(this.shape.y + bounds.height / 2);

        this.notifier =  new TH.Notifier(posX, posY);
    }

    Zone.prototype.addToCountry = function(country) {
        this.country = country;
        country.addZone(this);
    };
    Zone.prototype.update = function() {

        this.shape.gotoAndStop(this.health);
    };
    Zone.prototype.setFullHealth = function() {
        this.health = maxHealth;
        this.notifier.incrementedHealth(this.health + 1);
        this.update();
    };
    Zone.prototype.setHealth = function(value) {
        this.health = value;
        this.update();
    };
    Zone.prototype.hasFullHealth = function() {
        if (this.health === maxHealth) {
            return true;
        }
        return false;
    };
    Zone.prototype.hasNoHealth = function() {
        if (this.health === 0) {
            return true;
        }
        return false;
    };
    Zone.prototype.incrementHealth = function() {
        if (this.health < maxHealth) {
            this.health++;
            this.update();
            this.notifier.incrementedHealth(1);
            return true;
        }
        return false;
    };
    Zone.prototype.decrementHealth = function() {
        if (this.health) {
            this.health--;
            this.notifier.decrementedHealth(1);
            this.update();
            return true;
        }
        return false;

    };
    Zone.prototype.sendZoneData = function(successCallback) {

        var payload = {
            zoneId: this.id
        };
        $.ajax({
            type: 'POST',
            url: TH.global.endpoints.plant,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(payload),
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: successCallback,
            error: TH.global.errorHandler
        });
    };

    return Zone;
}());
