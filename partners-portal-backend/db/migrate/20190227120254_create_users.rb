class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users,id: :uuid do |t|
      t.string :firstname
      t.string :lastname
      t.string :username
      t.string :passkey
      t.string :email
      t.string :mobile
      t.uuid :created_by
      t.datetime :last_login_time
      t.boolean :logged_in
      t.boolean :stive_status
      t.timestamps
    end
  end
end
