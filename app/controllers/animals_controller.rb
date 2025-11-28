# frozen_string_literal: true

class AnimalsController < ApplicationController

  def index
    @pagy, @animals = pagy :keynav_js, Animal.order(id: :desc)
  end
end
