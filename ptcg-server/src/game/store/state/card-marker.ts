import { Card } from "../card/card";

interface MarkerItem {
  source: Card;
  name: string;
}

export class Marker {

  public markers: MarkerItem[] = [];

  hasMarker(name: string, source?: Card) {
    if (source === undefined) {
      return this.markers.some(c => c.name === name);
    }
    return this.markers.some(c => c.source === source && c.name === name);
  }

  removeMarker(name: string, source?: Card) {
    if (!this.hasMarker(name, source)) {
      return;
    }
    if (source === undefined) {
      this.markers = this.markers.filter(c => c.name !== name);
      return;
    }
    this.markers = this.markers.filter(c => c.source !== source || c.name !== name);
  }

  addMarker(name: string, source: Card) {
    if (this.hasMarker(name, source)) {
      return;
    }
    this.markers.push({ name, source });
  }
}
