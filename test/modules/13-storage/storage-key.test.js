QUnit.module('Storage Key', (hooks) => {
  initFixtures(hooks, `
     <toolcool-range-slider id="slider-1"></toolcool-range-slider>
     <toolcool-range-slider storage="session-storage" storage-key="test" value2="60" id="slider-99"></toolcool-range-slider>
     <toolcool-range-slider storage="session-storage" storage-key="test" id="slider-41"></toolcool-range-slider>
  `);

  QUnit.test('by default storage key should be "tc-range-slider"', (assert) => {
    const $slider = document.querySelector('#slider-1');
    assert.equal($slider.storageKey, 'tc-range-slider');
  });

  QUnit.test('provided storage key', (assert) => {
    const $slider = document.querySelector('#slider-41');
    assert.equal($slider.storageKey, 'test');
  });

  QUnit.test('add storage key property via set', (assert) => {
    const $slider = document.querySelector('#slider-1');
    $slider.storageKey = 'test-1';
    assert.equal($slider.storageKey, 'test-1');
  });

  QUnit.test('add storage key property via attribute', (assert) => {
    const $slider = document.querySelector('#slider-1');
    $slider.setAttribute('storage-key', 'test-2');
    assert.equal($slider.storageKey, 'test-2');
  });

  QUnit.test('in case of 2 pointers and storage enabled, storageKey2 should be "test-2"', (assert) => {
    const $slider = document.querySelector('#slider-99');
    assert.equal($slider.storageKey2, 'test-2');
  });
});
