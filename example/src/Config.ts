export default class Config {
	static getRemoteFiles = () => {
		return [
			'https://images.ctfassets.net/5u9bdkiurmat/70FWqtFtTGDzyq9O5JjV2T/4ec5166d40e32890e4b7c90eeb2a6f32/preload-gif-remote.gif',
			'https://images.ctfassets.net/5u9bdkiurmat/28twoItRtbLYuRL8Oa4l7u/024e828f0f094f611fe7be525ff07941/preload-jpg-remote.jpg',
			'https://images.ctfassets.net/5u9bdkiurmat/6DpnTbqUC3G295tij7Nsxe/10dbdf83ff32d5af1066545df950e61e/preload-png-remote.png'
		];
	};

	static getDynamicFiles = () => {
		return [
			'https://images.ctfassets.net/5u9bdkiurmat/LK1oUtgrb0X0w8Kx4aUuo/6656c80360b15d01236d0c595af236c8/preload-svg-remote.svg',
			'https://images.ctfassets.net/5u9bdkiurmat/HT0sV5rfT25BKu9h30sTD/26143aa33887e0ee7f456c310aa53ee0/preload-webp-remote.webp'
		];
	};

	static getCallerSuccess = () => {
		return true;
	};
}
