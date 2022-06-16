import { Category } from 'src/models/CategoryModel';
import { Profile } from 'src/models/ProfileModel';
import { Helper } from './helper';

/**
 * Session
 */
export class Session {

	/**
	 * Instance  of session
	 */
	private static instance: Session;

	/**
	 * Gets instance
	 * @returns
	 */
	static getInstance() {
		if (!Session.instance && !Session.load()) {
			Session.instance = new Session();
		}
		if (!Session.instance && Session.load()) {
			Session.instance = <Session>Session.load();
		}
		Session.save();
		return Session.instance;
	}

	/**
	 * Creates an instance of session.
	 */
	private constructor() {
		this.profiles = new Array<Profile>();

		for (let i = 1; i < 4; i++) {
			const profile = new Profile('Default ' + i);
			for (let i = 1; i < 4; i++) {
				profile.addCategory(
					new Category(
						Helper.getUUID(),
						'Kategorie ' + i,
						Helper.getRandomColor(),
						Helper.getRandomWords(Helper.getRandomInt(1, 10))
					)
				);
			}
			this.profiles.push(profile);
		}

		this.currentProfile = this.profiles[0];
	}

	/**
	 * Sets instance to local storage
	 */
	public static save() {
		localStorage.setItem('session', JSON.stringify(this.instance));
	}

	/**
	 * Gets instance from local storage
	 * @returns
	 */
	public static load(): Session | null {
		const session = localStorage.getItem('session');
		if (session) {
			const obj = <Session>JSON.parse(session);
			const result = new Session();
			result.profiles = obj.profiles;
			result.currentProfile = obj.currentProfile;
			return result;
		}
		return null;
	}

	/**
	 * Session id of session
	 */
	public readonly sessionId: string = Helper.getUUID();

	/**
	 * Profiles  of session
	 */
	public profiles: Array<Profile>;

	/**
	 * Active profile of session
	 */
	public currentProfile: Profile;

	/**
	 * Sets current profile
	 * @param profile
	 */
	setCurrentProfile(profile: Profile) {
		if (this.profiles.find(p => p.name === profile.name)) {
			this.currentProfile = <Profile>this.profiles.find(p => p.name === profile.name);
		} else {
			this.currentProfile = this.profiles[0];
		}
		Session.save();
	}

}