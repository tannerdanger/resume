import Component from './Component.js'

export default class AttributeComponent extends Component {
    constructor(entity, attributes) {
        super(entity)
        this.setAttributes(attributes)
        this.displayDamage = true
        this.isCombat = attributes.isCombat || false
        this.dmgTimer = 0
    }


    update() {

    }

    /**
     * Sets the default attributes. First it checks if the entity is assigned a value already,
     *  if not, it checks the passed in parameters, to assign value,
     *  if still null, assign default value
     *
     * @param attr
     */
    setAttributes(attr) {
        // Assign to `this` all properties in `defaultAttributes`, followed by all properties
        // in `attr`, with `attr` and all later listed objects overriding what's in `defaultAttributes`
        Object.assign(this, defaultAttributes, attr)
        this.HPFull = this.HP
        this.entity.UUID = this.Name + this.entity.UUID
    }
}

const defaultAttributes = {
    XpYield: 0,
    GoldYield: 0,
    HP: 9999999999, //default = basically immortal (all defined entities should have their HP defined). This is just for camera etc
    HPFull: 0 ,
    Mana: 0,
    Str: 0,
    Int: 0,
    Matk: 0,
    Atk: 0,
    AttackSpeed: 0,
    MoveSpeed: 0,
    Range: 0,
    Def: 0,
    Mdef: 0,
    Name: 'ENTITY',
    isCombat: false,
    isMelee: true,
    Los: 500
}