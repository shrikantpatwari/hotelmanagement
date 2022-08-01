import faker from 'faker'
import { IRoom, Room } from './room.model'

describe('Room model', () => {
  let newRoom: IRoom
  beforeEach(() => {
    newRoom = {
      name: faker.name.findName(),
      description: faker.lorem.paragraph(),
      images: [faker.image.animals(100, 100)],
      features: [faker.name.jobTitle()],
      bathroomAccessories: [faker.name.jobArea()],
      entertainment: [faker.name.jobType()],
      comforts: [faker.name.jobDescriptor()],
      pricePerNight: faker.datatype.number({min:1000, max:10000}),
      discountPercentge: faker.datatype.number({min:1, max:10}),
      customerRating: faker.datatype.number({min:5, max:10}),
      capacityAdult: faker.datatype.number({min: 1, max: 5}),
      capacityChild: faker.datatype.number({min: 1, max: 5}),
      noOfRooms: faker.datatype.number({min: 1, max: 5})
    }
  })

  it('should correctly validate', async () => {
    await expect(new Room(newRoom).validate()).resolves.toBeUndefined()
  })

  it('should throw a validation error if name is empty', async () => {
    delete newRoom.name
    await expect(new Room(newRoom).validate()).rejects.toThrow()
    newRoom.name = ''
    await expect(new Room(newRoom).validate()).rejects.toThrow()
  })

  it('should throw a validation error if name is less than 3 characters', async () => {
    newRoom.name = 'xx'
    await expect(new Room(newRoom).validate()).rejects.toThrow()
  })

  it('should throw a validation error if description is empty', async () => {
    delete newRoom.description
    await expect(new Room(newRoom).validate()).rejects.toThrow()
    newRoom.description = ''
    await expect(new Room(newRoom).validate()).rejects.toThrow()
  })

  it('should throw a validation error if description is more than 500 characters', async () => {
    newRoom.description = faker.lorem.word(501)
    await expect(new Room(newRoom).validate()).rejects.toThrow()
  })

  it('should throw a validation error if image is empty', async () => {
    delete newRoom.images
    await expect(new Room(newRoom).validate()).rejects.toThrow()
    newRoom.images = ['']
    await expect(new Room(newRoom).validate()).rejects.toThrow()
  })
})
