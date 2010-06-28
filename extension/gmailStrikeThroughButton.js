/**
 * Gmail Strikethrough button
 * Copyright, benleevolk, 2009
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Only define the button if it has not been defined
if(gmailStrikeThroughButton == undefined) {
  var gmailStrikeThroughButton = {
  
    strikethroughButton: null,
    underlineButton: null,
    activeButtonClassName: null,
    canvas_frame_document: null,
    text_editor: null,
  
    getIcon: function() {
      var icon = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEA"+"P8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kJDRI0ElGuqEoAAAAZdE"+"VYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAyUlEQVQ4y83TP0pDQRDH8Y8GYm2"+"nhUUKKxNJ9AQpU6TwBnqIHCCQwkMEz6FdEHIBG7UQUtq8IlUeKDybeRDC+2eqDCwL+/vNd2bZ"+"WQ4xRnhGgt/Yl5jhui75HlmYz9DCKe6wCq0yvsLUKtBumwB+wnSz7/3fA5Bgii6O/gMYYxOQf"+"K3xikdc7ibk9GzPjht1d44HfEShzypzhk6JdhF6un14XGCclADyxLe6DjLMMcAJ2ujjJSDDKk"+"Avnm+B75iLNAbsCVeH9/P+AIavLWYxaRcUAAAAAElFTkSuQmCC";
      return icon;
    },
  
    getActiveButtonClassName: function() {
      var xPathResult = this.canvas_frame_document.evaluate("//img[@command='+justifyLeft']",this.canvas_frame_document, null, 
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      var allClasses=xPathResult.snapshotItem(0).className.split(" "); // a small hack to get the active button class name
      if (allClasses.length > 2) {
        this.activeButtonClassName=allClasses[allClasses.length-1]; // rather than using a constant, since the one of the "justify" button is initially active
      } else {
        xPathResult = this.canvas_frame_document.evaluate("//img[@command='+justifyRight']", this.canvas_frame_document, null, 
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        allClasses=xPathResult.snapshotItem(0).className.split(" ");
        this.activeButtonClassName=allClasses[allClasses.length-1];
      }
    },
  
    setStrikeThrough: function() {
      gmailStrikeThroughButton.text_editor.execCommand("strikethrough", false, '');
      gmailStrikeThroughButton.checkForStrikes();
    },
  
    addButton: function() {
      this.strikethroughButton=this.underlineButton.cloneNode(true);
      this.strikethroughButton.setAttribute("title", "Strikethrough");
      this.strikethroughButton.setAttribute("command", "+strikethrough");
  
      this.strikethroughButton.style.backgroundImage="url(data:image/png;base64," + gmailStrikeThroughButton.getIcon() + ")";
      this.strikethroughButton.style.backgroundRepeat="no-repeat";
      this.strikethroughButton.style.backgroundPosition="0px 0px";
  
      this.strikethroughButton.addEventListener("click", gmailStrikeThroughButton.setStrikeThrough, false);
      this.underlineButton.parentNode.appendChild(this.strikethroughButton);
  
    },
  
    checkForStrikes: function() {
      var classRegEx = new RegExp(" " + gmailStrikeThroughButton.activeButtonClassName, "g");
      if (gmailStrikeThroughButton.text_editor.queryCommandState("strikethrough")) {
        if (!gmailStrikeThroughButton.strikethroughButton.className.match(classRegEx)) {
          gmailStrikeThroughButton.strikethroughButton.className+=" " + gmailStrikeThroughButton.activeButtonClassName; // add active state
        }
      } else {
        gmailStrikeThroughButton.strikethroughButton.className=gmailStrikeThroughButton.strikethroughButton.className.replace(classRegEx, ""); // remove active state
      }
    },
    
    /**
     * Load Canvas, loads the Gmail canvas
     */
    loadCanvas: function() {
      if (document.getElementById("canvas_frame")) {
        this.canvas_frame_document = document.getElementById("canvas_frame").contentDocument;
        this.text_editor = this.canvas_frame_document.evaluate("//iframe[contains(@class, 'editable')]", this.canvas_frame_document, null, 
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).contentDocument
      } else {
        this.canvas_frame_document = window.parent.document;
        this.text_editor = document;
      }
      if (!this.text_editor) return false;
      var xPathResult = this.canvas_frame_document.evaluate("//img[@command='+underline']", this.canvas_frame_document, null, 
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      if (this.underlineButton=xPathResult.snapshotItem(0)) { // =!
        this.getActiveButtonClassName();
        return true;
      }
      return false;
    },
    
    /**
     * Destroy, destroys the current instance
     */
    destroy: function() {
      this.strikethroughButton = null;
      this.underlineButton = null;
      this.activeButtonClassName = null;
      this.canvas_frame_document = null;
      this.text_editor = null;
    },
  
    init: function() {
      this.destroy();
      if(this.loadCanvas()) {
        this.addButton();
        this.text_editor.addEventListener("click", this.checkForStrikes, false);
        this.text_editor.addEventListener("keyup", this.checkForStrikes, false);
      }
      return;
    },
    
    /**
     * Reinit, reinitalize gmailstrikethrough
     */
    reinit: function() {
      var hasButton = false;
      
      // Reload the current canvas
      gmailStrikeThroughButton.loadCanvas();
      
      // Search for canvas buttons 
      var children = gmailStrikeThroughButton.underlineButton.parentNode.children;
      for(var i = 0; i < children.length; i++) {
        if(children[i].title == 'Strikethrough') {
          hasButton = true;
        }
      }
      
      // If button doesn't exist
      if(!hasButton) {
        gmailStrikeThroughButton.init();
      }
    }
  }
  
  gmailStrikeThroughButton.init();
} 
// Reinitalize the button
else {
  gmailStrikeThroughButton.reinit();
}
