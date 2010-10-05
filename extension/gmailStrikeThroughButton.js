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
  
    debug: false,
    richTextBar: null,
    strikethroughButton: null,
    underlineButton: null,
    activeButtonClassName: null,
    canvas_frame_document: null,
    text_editor: null,
  
    /**
     * Get Icon
     */
    getIcon: function() {
      var icon = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEA"+"P8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kJDRI0ElGuqEoAAAAZdE"+"VYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAyUlEQVQ4y83TP0pDQRDH8Y8GYm2"+"nhUUKKxNJ9AQpU6TwBnqIHCCQwkMEz6FdEHIBG7UQUtq8IlUeKDybeRDC+2eqDCwL+/vNd2bZ"+"WQ4xRnhGgt/Yl5jhui75HlmYz9DCKe6wCq0yvsLUKtBumwB+wnSz7/3fA5Bgii6O/gMYYxOQf"+"K3xikdc7ibk9GzPjht1d44HfEShzypzhk6JdhF6un14XGCclADyxLe6DjLMMcAJ2ujjJSDDKk"+"Avnm+B75iLNAbsCVeH9/P+AIavLWYxaRcUAAAAAElFTkSuQmCC";
      return icon;
    },
  
    /**
     * Get Active Button Class Name
     */
    getActiveButtonClassName: function() {
      var xPathResult = this.canvas_frame_document.evaluate("//img[@command='+justifyLeft']",this.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      
      if(xPathResult.snapshotItem(0) == null) return false;
      
      // a small hack to get the active button class name
      var allClasses=xPathResult.snapshotItem(0).className.split(" ");
      
      if(allClasses.length > 2) {
        /* rather than using a constant, since the one of the "justify" button is initially active */
        this.activeButtonClassName = allClasses[allClasses.length-1]; 
        return true;
      } 
      
      xPathResult = this.canvas_frame_document.evaluate("//img[@command='+justifyRight']", this.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      
      allClasses=xPathResult.snapshotItem(0).className.split(" ");
      
      if(allClasses.length <= 2) return false;
      this.activeButtonClassName = allClasses[allClasses.length-1];
      return true;
    },
    
    /**
     * Set Strike Through
     */
    setStrikeThrough: function() {
      if(gmailStrikeThroughButton.text_editor == null) {
        if(gmailStrikeThroughButton.loadTextEditor() == false) {
          return false;
        }
      }
      gmailStrikeThroughButton.text_editor.execCommand("strikethrough", false, '');
      gmailStrikeThroughButton.checkForStrikes();
    },
    
    /**
     * Add Button
     */
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
  
    /**
     * Check for strikes
     */
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
     * Load the text editor
     */
    loadTextEditor: function() {
      this.text_editor = null;
      if(document.getElementById('canvas_frame')) {
        var xPathResult = this.canvas_frame_document.evaluate("//iframe[contains(@class, 'editable')]", this.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            
        if(xPathResult.snapshotItem(0) != null) {
          this.text_editor = xPathResult.snapshotItem(0).contentDocument;
        }
      }
      else {
        this.text_editor = document;
      }
      
      if(this.text_editor == null) return false;
      
      // Start Listeners
      this.text_editor.addEventListener("click", this.checkForStrikes, false);
      this.text_editor.addEventListener("keyup", this.checkForStrikes, false);
      return true;
    },
    
    /**
     * Load Rich Text Bar, loads the rich text bar
     */
    loadRichTextBar: function() {      
      var xPathResult = this.canvas_frame_document.evaluate("//img[@command='+underline']", this.canvas_frame_document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      
      if(this.underlineButton=xPathResult.snapshotItem(0)) {
        this.addButton();
        return true;
      }
      return false;
    },
    
    /**
     * Ping Canvas, monitors the canvas for any change in the rich text bar
     *
     * Used to 
     */
    pingCanvas: function() {
      if( gmailStrikeThroughButton.canvas_frame_document .getElementById("GmailRichTextBar") == null) {
        if(gmailStrikeThroughButton.getActiveButtonClassName()) {
          var xPathResult = this.evaluate("//img[@command='+bold']", this, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
          gmailStrikeThroughButton.richTextBar = xPathResult.snapshotItem(0) .parentNode.parentNode;
          gmailStrikeThroughButton.richTextBar.setAttribute('id', 'GmailRichTextBar');
          
          gmailStrikeThroughButton.loadRichTextBar();
        }
        gmailStrikeThroughButton.loadTextEditor();
      }
    },
    
    /**
     * Load Canvas, loads the Gmail canvas
     */
    loadCanvas: function() {
      this.debug && console.log('Loading canvas...');
      if(document.getElementById("canvas_frame")) {
        this.canvas_frame_document = document.getElementById("canvas_frame").contentDocument;
      }
      else {
        this.canvas_frame_document = window.parent.document;
      }
      // Start canvas monitor
      this.canvas_frame_document.addEventListener("DOMSubtreeModified", this.pingCanvas, false);
    }
  }
  
  // Initalize gmail strike through
  gmailStrikeThroughButton.loadCanvas();
}