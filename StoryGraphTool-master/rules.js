class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Start");
    }

    handleChoice() {
        this.engine.gotoScene(Location, "Kresge"); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = key; // TODO: use `key` to get the data object for the current story location
        this.engine.show(key.Location); // TODO: replace this text by the Body of the location data
        
        if(length(key.locationData.choice) > 0) { // TODO: check if the location has any Choices
            for(let choice of key.locationData.choice) { // TODO: loop over the location's Choices
                this.engine.addChoice("action text"); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');