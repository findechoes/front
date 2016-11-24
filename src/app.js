export class App {
  configureRouter(config, router) {
    config.title = 'Find Echoes';
    config.map([
        { route: '', moduleId: 'place-picker' },
        { route: 'spot/:id', moduleId: 'spot-detail', name: 'spot' }
    ]);

    this.router = router;
  }
}
