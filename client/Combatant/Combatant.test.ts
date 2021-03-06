import { StatBlock } from "../../common/StatBlock";
import { Encounter } from "../Encounter/Encounter";
import { InitializeSettings } from "../Settings/Settings";
import { buildEncounter } from "../test/buildEncounter";

describe("Combatant", () => {
    let encounter: Encounter;
    beforeEach(() => {
        
        InitializeSettings();
        encounter = buildEncounter();
    });
    
    test("Should have its Max HP set from the statblock", () => {
        const combatant = encounter.AddCombatantFromStatBlock({ ...StatBlock.Default(), HP: { Value: 10, Notes: "" } });
    
        expect(combatant.MaxHP()).toBe(10);
    });

    test("Should update its Max HP when its statblock is updated", () => {
        const combatant = encounter.AddCombatantFromStatBlock({ ...StatBlock.Default(), Player: "player" });
    
        combatant.StatBlock({ ...StatBlock.Default(), HP: { Value: 15, Notes: "" } });
        expect(combatant.MaxHP()).toBe(15);
    });

    test("Should notify the encounter when its statblock is updated", () => {
        const combatant = encounter.AddCombatantFromStatBlock({ ...StatBlock.Default(), Player: "player" });
        const combatantsSpy = jest.fn();
        encounter.Combatants.subscribe(combatantsSpy);
    
        combatant.StatBlock({ ...StatBlock.Default(), HP: { Value: 15, Notes: "" } });
        expect(combatantsSpy).toBeCalled();
    });

    describe("Index labeling", () => {
        test("A lone combatant is not index labelled.", () => {
            const statBlock = { ...StatBlock.Default(), Name: "Goblin" };
            const combatant1 = encounter.AddCombatantFromStatBlock(statBlock);
            expect(combatant1.DisplayName()).toEqual("Goblin");
        });

        test("When multiple combatants are added with the same name, they should display index labels.", () => {
            const statBlock = { ...StatBlock.Default(), Name: "Goblin" };
            
            const combatant1 = encounter.AddCombatantFromStatBlock(statBlock);
            const combatant2 = encounter.AddCombatantFromStatBlock(statBlock);
            expect(combatant1.DisplayName()).toEqual("Goblin 1");
            expect(combatant2.DisplayName()).toEqual("Goblin 2");
        });

        test("When a combatant statblock name changes, it receives an index label if necessary", () => {
            const statBlock1 = { ...StatBlock.Default(), Name: "Goblin" };
            const statBlock2 = { ...StatBlock.Default(), Name: "Not Goblin" };
            
            const combatant1 = encounter.AddCombatantFromStatBlock(statBlock1);
            const combatant2 = encounter.AddCombatantFromStatBlock(statBlock2);
            combatant2.StatBlock(statBlock1);

            expect(combatant1.DisplayName()).toEqual("Goblin 1");
            expect(combatant2.DisplayName()).toEqual("Goblin 2");
         });
    });
});