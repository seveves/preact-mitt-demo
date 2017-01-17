import { Component, h } from 'preact';

import ListItem from '../list-item';

export default class List extends Component<{}, { items: any[] }> {

  state = { items: [
    { text: 'Item A'},
    { text: 'Item B'},
    { text: 'Item C'},
    { text: 'Item D'}]
  };

  public render() {
    return (
      <div class="sde-list">
        { this.state.items.map((item, i) => (
          <ListItem onAction={this.do} text={item.text} index={i} key={item.text}></ListItem>))}
      </div>
    );
  }

  private do = (action: string, index: number) => {
    if (action === 'right') {
      console.log('Item removed (right): ' + index);
    } else {
      console.log('Item removed (left): ' + index);
    } 
    let items = this.state.items;
    items.splice(index, 1); 
    this.setState({ items });
  }
}