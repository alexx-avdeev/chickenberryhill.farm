class CreateAnimals < ActiveRecord::Migration[8.1]
  def change
    create_table :animals do |t|
      t.timestamp :date_of_birth, null: true
      t.boolean :date_of_birth_is_approximate, null: false, default: false
      t.timestamp :date_of_death, null: true
      t.integer :death_reason, null: true
      t.string :name, null: true
      t.string :tag, null: true

      t.timestamps
    end
  end
end
