module ImprovedInitiative {
    export class Store {
		private static _prefix = "ImprovedInitiative";
		
        static PlayerCharacters: string = "PlayerCharacters";
        static Creatures: string = "Creatures";
        static SavedEncounters: string = "SavedEncounters";
        static User: string = "User";
        static KeyBindings: string = "KeyBindings";
        static ActionBar: string = "ActionBar";
        
        static List(listName: string): string[] {
			var listKey = `${Store._prefix}.${listName}`;
			var list = Store.load(listKey);
			if(list && list.constructor === Array){
				return list;
			}
			Store.save(listKey, []);
			return [];
		}
		static Save<T> (listName: string, key: string, value: T) {
            if(typeof(key) !== "string"){
                throw `Can't save to non-string key ${key}`;
            }
			var listKey = `${Store._prefix}.${listName}`;
			var fullKey = `${Store._prefix}.${listName}.${key}`;
			var list = Store.List(listName);
			if(list.indexOf(key) == -1){
				list.push(key);
				Store.save(listKey, list);
			}
			Store.save(fullKey, value);
		}
		static Load<T>(listName: string, key: string): T {
			var fullKey = `${Store._prefix}.${listName}.${key}`;
			return Store.load(fullKey);
		}
		static Delete<T>(listName: string, key: string) {
			var listKey = `${Store._prefix}.${listName}`;
			var fullKey = `${Store._prefix}.${listName}.${key}`;
			var list = Store.List(listName);
			var keyIndex = list.indexOf(key);
			if(keyIndex != -1){
				list.splice(keyIndex, 1);
				Store.save(listKey, list);
			}
			localStorage.removeItem(fullKey);
		}
        
        private static save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
		private static load = (key) => {
            var value = localStorage.getItem(key);
            if(value === "undefined") { return null; }
            return JSON.parse(value);
        };
	}
}