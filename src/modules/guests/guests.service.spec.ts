import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { STORAGE_SERVICE } from '../../common/services';
import { Guest } from './entities/guest.entity';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { AccompanyingGuest } from './entities/accompanying-guest.entity';
import { GuestAgreement } from './entities/guest-agreement.entity';
import { GuestsService } from './guests.service';
import { HotelSettingsService } from '../hotel-settings/hotel-settings.service';
import { RoomTypesService } from '../room-types/room-types.service';
import { UsersService } from '../users/users.service';

describe('GuestsService booking analytics', () => {
  let moduleRef: TestingModule;
  let guestsService: GuestsService;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 13, 12));

    moduleRef = await Test.createTestingModule({
      providers: [
        GuestsService,
        {
          provide: getRepositoryToken(Guest),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn().mockResolvedValue([
              {
                checkInDate: '2026-11-13',
                checkOutDate: null,
                status: ReservationStatus.CHECKED_IN,
              },
            ]),
          },
        },
        {
          provide: getRepositoryToken(AccompanyingGuest),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GuestAgreement),
          useValue: {},
        },
        { provide: STORAGE_SERVICE, useValue: {} },
        { provide: RoomTypesService, useValue: {} },
        { provide: EventEmitter2, useValue: {} },
        {
          provide: HotelSettingsService,
          useValue: { getSettings: jest.fn().mockResolvedValue({ totalRooms: 0 }) },
        },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    guestsService = moduleRef.get(GuestsService);
  });

  afterEach(async () => {
    await moduleRef.close();
    jest.useRealTimers();
  });

  it('handles date-only reservation values returned by the database', async () => {
    const analytics = await guestsService.getBookingAnalytics('today');

    expect(analytics.totalReservations).toBe(1);
    expect(analytics.peakDayOfWeek[5].count).toBe(1);
    expect(analytics.avgLengthOfStayDays).toBe(1);
  });
});
