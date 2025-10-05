import { z } from 'zod';
export declare const messageDirectionSchema: z.ZodEnum<['inbound', 'outbound']>;
export type MessageDirection = z.infer<typeof messageDirectionSchema>;
export declare const messageSourceSchema: z.ZodEnum<['jivo', 'whatsapp', 'system']>;
export type MessageSource = z.infer<typeof messageSourceSchema>;
export declare const messagePayloadTypeSchema: z.ZodEnum<
  [
    'text',
    'photo',
    'video',
    'audio',
    'document',
    'location',
    'keyboard',
    'rate',
    'typing',
    'start',
    'stop',
    'seen',
  ]
>;
export type MessagePayloadType = z.infer<typeof messagePayloadTypeSchema>;
export declare const textPayloadSchema: z.ZodObject<
  {
    text: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    text: string;
  },
  {
    text: string;
  }
>;
export declare const mediaPayloadSchema: z.ZodObject<
  {
    url: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodNumber;
    caption: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    url: string;
    mimeType: string;
    sizeBytes: number;
    caption?: string | undefined;
  },
  {
    url: string;
    mimeType: string;
    sizeBytes: number;
    caption?: string | undefined;
  }
>;
export declare const locationPayloadSchema: z.ZodObject<
  {
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    latitude: number;
    longitude: number;
    name?: string | undefined;
    address?: string | undefined;
  },
  {
    latitude: number;
    longitude: number;
    name?: string | undefined;
    address?: string | undefined;
  }
>;
export declare const keyboardOptionSchema: z.ZodObject<
  {
    id: z.ZodString;
    text: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: string;
    text: string;
    image?: string | undefined;
  },
  {
    id: string;
    text: string;
    image?: string | undefined;
  }
>;
export declare const keyboardPayloadSchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    multiple: z.ZodOptional<z.ZodBoolean>;
    options: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          text: z.ZodString;
          image: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          id: string;
          text: string;
          image?: string | undefined;
        },
        {
          id: string;
          text: string;
          image?: string | undefined;
        }
      >,
      'many'
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    options: {
      id: string;
      text: string;
      image?: string | undefined;
    }[];
    text?: string | undefined;
    title?: string | undefined;
    multiple?: boolean | undefined;
  },
  {
    options: {
      id: string;
      text: string;
      image?: string | undefined;
    }[];
    text?: string | undefined;
    title?: string | undefined;
    multiple?: boolean | undefined;
  }
>;
export declare const messagePayloadSchema: z.ZodDiscriminatedUnion<
  'type',
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'text'>;
        data: z.ZodObject<
          {
            text: z.ZodString;
          },
          'strip',
          z.ZodTypeAny,
          {
            text: string;
          },
          {
            text: string;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          text: string;
        };
        type: 'text';
      },
      {
        data: {
          text: string;
        };
        type: 'text';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'photo'>;
        data: z.ZodObject<
          {
            url: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            caption: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          },
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'photo';
      },
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'photo';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'video'>;
        data: z.ZodObject<
          {
            url: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            caption: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          },
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'video';
      },
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'video';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'audio'>;
        data: z.ZodObject<
          {
            url: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            caption: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          },
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'audio';
      },
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'audio';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'document'>;
        data: z.ZodObject<
          {
            url: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            caption: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          },
          {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'document';
      },
      {
        data: {
          url: string;
          mimeType: string;
          sizeBytes: number;
          caption?: string | undefined;
        };
        type: 'document';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'location'>;
        data: z.ZodObject<
          {
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            latitude: number;
            longitude: number;
            name?: string | undefined;
            address?: string | undefined;
          },
          {
            latitude: number;
            longitude: number;
            name?: string | undefined;
            address?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          latitude: number;
          longitude: number;
          name?: string | undefined;
          address?: string | undefined;
        };
        type: 'location';
      },
      {
        data: {
          latitude: number;
          longitude: number;
          name?: string | undefined;
          address?: string | undefined;
        };
        type: 'location';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'keyboard'>;
        data: z.ZodObject<
          {
            title: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            multiple: z.ZodOptional<z.ZodBoolean>;
            options: z.ZodArray<
              z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodString;
                  image: z.ZodOptional<z.ZodString>;
                },
                'strip',
                z.ZodTypeAny,
                {
                  id: string;
                  text: string;
                  image?: string | undefined;
                },
                {
                  id: string;
                  text: string;
                  image?: string | undefined;
                }
              >,
              'many'
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            options: {
              id: string;
              text: string;
              image?: string | undefined;
            }[];
            text?: string | undefined;
            title?: string | undefined;
            multiple?: boolean | undefined;
          },
          {
            options: {
              id: string;
              text: string;
              image?: string | undefined;
            }[];
            text?: string | undefined;
            title?: string | undefined;
            multiple?: boolean | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          options: {
            id: string;
            text: string;
            image?: string | undefined;
          }[];
          text?: string | undefined;
          title?: string | undefined;
          multiple?: boolean | undefined;
        };
        type: 'keyboard';
      },
      {
        data: {
          options: {
            id: string;
            text: string;
            image?: string | undefined;
          }[];
          text?: string | undefined;
          title?: string | undefined;
          multiple?: boolean | undefined;
        };
        type: 'keyboard';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'rate'>;
        data: z.ZodObject<
          {
            value: z.ZodNumber;
          },
          'strip',
          z.ZodTypeAny,
          {
            value: number;
          },
          {
            value: number;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          value: number;
        };
        type: 'rate';
      },
      {
        data: {
          value: number;
        };
        type: 'rate';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'typing'>;
        data: z.ZodObject<
          {
            text: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            text?: string | undefined;
          },
          {
            text?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          text?: string | undefined;
        };
        type: 'typing';
      },
      {
        data: {
          text?: string | undefined;
        };
        type: 'typing';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'start'>;
        data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {};
        type: 'start';
      },
      {
        data: {};
        type: 'start';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'stop'>;
        data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {};
        type: 'stop';
      },
      {
        data: {};
        type: 'stop';
      }
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'seen'>;
        data: z.ZodObject<
          {
            messageId: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            messageId?: string | undefined;
          },
          {
            messageId?: string | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        data: {
          messageId?: string | undefined;
        };
        type: 'seen';
      },
      {
        data: {
          messageId?: string | undefined;
        };
        type: 'seen';
      }
    >,
  ]
>;
export type MessagePayload = z.infer<typeof messagePayloadSchema>;
export declare const participantSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: string;
    name?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
  },
  {
    id: string;
    name?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
  }
>;
export type Participant = z.infer<typeof participantSchema>;
export declare const messageEnvelopeSchema: z.ZodObject<
  {
    tenantId: z.ZodString;
    conversationId: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
    direction: z.ZodEnum<['inbound', 'outbound']>;
    source: z.ZodEnum<['jivo', 'whatsapp', 'system']>;
    payload: z.ZodDiscriminatedUnion<
      'type',
      [
        z.ZodObject<
          {
            type: z.ZodLiteral<'text'>;
            data: z.ZodObject<
              {
                text: z.ZodString;
              },
              'strip',
              z.ZodTypeAny,
              {
                text: string;
              },
              {
                text: string;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              text: string;
            };
            type: 'text';
          },
          {
            data: {
              text: string;
            };
            type: 'text';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'photo'>;
            data: z.ZodObject<
              {
                url: z.ZodString;
                mimeType: z.ZodString;
                sizeBytes: z.ZodNumber;
                caption: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              },
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'photo';
          },
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'photo';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'video'>;
            data: z.ZodObject<
              {
                url: z.ZodString;
                mimeType: z.ZodString;
                sizeBytes: z.ZodNumber;
                caption: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              },
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'video';
          },
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'video';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'audio'>;
            data: z.ZodObject<
              {
                url: z.ZodString;
                mimeType: z.ZodString;
                sizeBytes: z.ZodNumber;
                caption: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              },
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'audio';
          },
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'audio';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'document'>;
            data: z.ZodObject<
              {
                url: z.ZodString;
                mimeType: z.ZodString;
                sizeBytes: z.ZodNumber;
                caption: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              },
              {
                url: string;
                mimeType: string;
                sizeBytes: number;
                caption?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'document';
          },
          {
            data: {
              url: string;
              mimeType: string;
              sizeBytes: number;
              caption?: string | undefined;
            };
            type: 'document';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'location'>;
            data: z.ZodObject<
              {
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                address: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                latitude: number;
                longitude: number;
                name?: string | undefined;
                address?: string | undefined;
              },
              {
                latitude: number;
                longitude: number;
                name?: string | undefined;
                address?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              latitude: number;
              longitude: number;
              name?: string | undefined;
              address?: string | undefined;
            };
            type: 'location';
          },
          {
            data: {
              latitude: number;
              longitude: number;
              name?: string | undefined;
              address?: string | undefined;
            };
            type: 'location';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'keyboard'>;
            data: z.ZodObject<
              {
                title: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                multiple: z.ZodOptional<z.ZodBoolean>;
                options: z.ZodArray<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodString;
                      image: z.ZodOptional<z.ZodString>;
                    },
                    'strip',
                    z.ZodTypeAny,
                    {
                      id: string;
                      text: string;
                      image?: string | undefined;
                    },
                    {
                      id: string;
                      text: string;
                      image?: string | undefined;
                    }
                  >,
                  'many'
                >;
              },
              'strip',
              z.ZodTypeAny,
              {
                options: {
                  id: string;
                  text: string;
                  image?: string | undefined;
                }[];
                text?: string | undefined;
                title?: string | undefined;
                multiple?: boolean | undefined;
              },
              {
                options: {
                  id: string;
                  text: string;
                  image?: string | undefined;
                }[];
                text?: string | undefined;
                title?: string | undefined;
                multiple?: boolean | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              options: {
                id: string;
                text: string;
                image?: string | undefined;
              }[];
              text?: string | undefined;
              title?: string | undefined;
              multiple?: boolean | undefined;
            };
            type: 'keyboard';
          },
          {
            data: {
              options: {
                id: string;
                text: string;
                image?: string | undefined;
              }[];
              text?: string | undefined;
              title?: string | undefined;
              multiple?: boolean | undefined;
            };
            type: 'keyboard';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'rate'>;
            data: z.ZodObject<
              {
                value: z.ZodNumber;
              },
              'strip',
              z.ZodTypeAny,
              {
                value: number;
              },
              {
                value: number;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              value: number;
            };
            type: 'rate';
          },
          {
            data: {
              value: number;
            };
            type: 'rate';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'typing'>;
            data: z.ZodObject<
              {
                text: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                text?: string | undefined;
              },
              {
                text?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              text?: string | undefined;
            };
            type: 'typing';
          },
          {
            data: {
              text?: string | undefined;
            };
            type: 'typing';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'start'>;
            data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {};
            type: 'start';
          },
          {
            data: {};
            type: 'start';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'stop'>;
            data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {};
            type: 'stop';
          },
          {
            data: {};
            type: 'stop';
          }
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'seen'>;
            data: z.ZodObject<
              {
                messageId: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                messageId?: string | undefined;
              },
              {
                messageId?: string | undefined;
              }
            >;
          },
          'strip',
          z.ZodTypeAny,
          {
            data: {
              messageId?: string | undefined;
            };
            type: 'seen';
          },
          {
            data: {
              messageId?: string | undefined;
            };
            type: 'seen';
          }
        >,
      ]
    >;
    sender: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
      },
      'strip',
      z.ZodTypeAny,
      {
        id: string;
        name?: string | undefined;
        phone?: string | undefined;
        avatar?: string | undefined;
      },
      {
        id: string;
        name?: string | undefined;
        phone?: string | undefined;
        avatar?: string | undefined;
      }
    >;
    recipient: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          name: z.ZodOptional<z.ZodString>;
          phone: z.ZodOptional<z.ZodString>;
          avatar: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          id: string;
          name?: string | undefined;
          phone?: string | undefined;
          avatar?: string | undefined;
        },
        {
          id: string;
          name?: string | undefined;
          phone?: string | undefined;
          avatar?: string | undefined;
        }
      >
    >;
    occurredAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    tenantId: string;
    conversationId: string;
    direction: 'inbound' | 'outbound';
    source: 'jivo' | 'whatsapp' | 'system';
    payload:
      | {
          data: {
            text: string;
          };
          type: 'text';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'photo';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'video';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'audio';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'document';
        }
      | {
          data: {
            latitude: number;
            longitude: number;
            name?: string | undefined;
            address?: string | undefined;
          };
          type: 'location';
        }
      | {
          data: {
            options: {
              id: string;
              text: string;
              image?: string | undefined;
            }[];
            text?: string | undefined;
            title?: string | undefined;
            multiple?: boolean | undefined;
          };
          type: 'keyboard';
        }
      | {
          data: {
            value: number;
          };
          type: 'rate';
        }
      | {
          data: {
            text?: string | undefined;
          };
          type: 'typing';
        }
      | {
          data: {};
          type: 'start';
        }
      | {
          data: {};
          type: 'stop';
        }
      | {
          data: {
            messageId?: string | undefined;
          };
          type: 'seen';
        };
    sender: {
      id: string;
      name?: string | undefined;
      phone?: string | undefined;
      avatar?: string | undefined;
    };
    occurredAt: string;
    metadata?: Record<string, any> | undefined;
    correlationId?: string | undefined;
    recipient?:
      | {
          id: string;
          name?: string | undefined;
          phone?: string | undefined;
          avatar?: string | undefined;
        }
      | undefined;
  },
  {
    tenantId: string;
    conversationId: string;
    direction: 'inbound' | 'outbound';
    source: 'jivo' | 'whatsapp' | 'system';
    payload:
      | {
          data: {
            text: string;
          };
          type: 'text';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'photo';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'video';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'audio';
        }
      | {
          data: {
            url: string;
            mimeType: string;
            sizeBytes: number;
            caption?: string | undefined;
          };
          type: 'document';
        }
      | {
          data: {
            latitude: number;
            longitude: number;
            name?: string | undefined;
            address?: string | undefined;
          };
          type: 'location';
        }
      | {
          data: {
            options: {
              id: string;
              text: string;
              image?: string | undefined;
            }[];
            text?: string | undefined;
            title?: string | undefined;
            multiple?: boolean | undefined;
          };
          type: 'keyboard';
        }
      | {
          data: {
            value: number;
          };
          type: 'rate';
        }
      | {
          data: {
            text?: string | undefined;
          };
          type: 'typing';
        }
      | {
          data: {};
          type: 'start';
        }
      | {
          data: {};
          type: 'stop';
        }
      | {
          data: {
            messageId?: string | undefined;
          };
          type: 'seen';
        };
    sender: {
      id: string;
      name?: string | undefined;
      phone?: string | undefined;
      avatar?: string | undefined;
    };
    occurredAt: string;
    metadata?: Record<string, any> | undefined;
    correlationId?: string | undefined;
    recipient?:
      | {
          id: string;
          name?: string | undefined;
          phone?: string | undefined;
          avatar?: string | undefined;
        }
      | undefined;
  }
>;
export type MessageEnvelope = z.infer<typeof messageEnvelopeSchema>;
export declare const jivoWebhookPayloadSchema: z.ZodObject<
  {
    eventId: z.ZodString;
    tenantId: z.ZodString;
    jivoChannelId: z.ZodString;
    raw: z.ZodRecord<z.ZodString, z.ZodAny>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    tenantId: string;
    eventId: string;
    jivoChannelId: string;
    raw: Record<string, any>;
    headers?: Record<string, any> | undefined;
  },
  {
    tenantId: string;
    eventId: string;
    jivoChannelId: string;
    raw: Record<string, any>;
    headers?: Record<string, any> | undefined;
  }
>;
export type JivoWebhookPayload = z.infer<typeof jivoWebhookPayloadSchema>;
export declare const queueEnvelopeSchema: z.ZodDiscriminatedUnion<
  'type',
  [
    z.ZodObject<
      {
        id: z.ZodString;
        type: z.ZodLiteral<'message'>;
        createdAt: z.ZodString;
        payload: z.ZodObject<
          {
            tenantId: z.ZodString;
            conversationId: z.ZodString;
            correlationId: z.ZodOptional<z.ZodString>;
            direction: z.ZodEnum<['inbound', 'outbound']>;
            source: z.ZodEnum<['jivo', 'whatsapp', 'system']>;
            payload: z.ZodDiscriminatedUnion<
              'type',
              [
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'text'>;
                    data: z.ZodObject<
                      {
                        text: z.ZodString;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        text: string;
                      },
                      {
                        text: string;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      text: string;
                    };
                    type: 'text';
                  },
                  {
                    data: {
                      text: string;
                    };
                    type: 'text';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'photo'>;
                    data: z.ZodObject<
                      {
                        url: z.ZodString;
                        mimeType: z.ZodString;
                        sizeBytes: z.ZodNumber;
                        caption: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      },
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'photo';
                  },
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'photo';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'video'>;
                    data: z.ZodObject<
                      {
                        url: z.ZodString;
                        mimeType: z.ZodString;
                        sizeBytes: z.ZodNumber;
                        caption: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      },
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'video';
                  },
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'video';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'audio'>;
                    data: z.ZodObject<
                      {
                        url: z.ZodString;
                        mimeType: z.ZodString;
                        sizeBytes: z.ZodNumber;
                        caption: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      },
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'audio';
                  },
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'audio';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'document'>;
                    data: z.ZodObject<
                      {
                        url: z.ZodString;
                        mimeType: z.ZodString;
                        sizeBytes: z.ZodNumber;
                        caption: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      },
                      {
                        url: string;
                        mimeType: string;
                        sizeBytes: number;
                        caption?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'document';
                  },
                  {
                    data: {
                      url: string;
                      mimeType: string;
                      sizeBytes: number;
                      caption?: string | undefined;
                    };
                    type: 'document';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'location'>;
                    data: z.ZodObject<
                      {
                        latitude: z.ZodNumber;
                        longitude: z.ZodNumber;
                        name: z.ZodOptional<z.ZodString>;
                        address: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        latitude: number;
                        longitude: number;
                        name?: string | undefined;
                        address?: string | undefined;
                      },
                      {
                        latitude: number;
                        longitude: number;
                        name?: string | undefined;
                        address?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      latitude: number;
                      longitude: number;
                      name?: string | undefined;
                      address?: string | undefined;
                    };
                    type: 'location';
                  },
                  {
                    data: {
                      latitude: number;
                      longitude: number;
                      name?: string | undefined;
                      address?: string | undefined;
                    };
                    type: 'location';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'keyboard'>;
                    data: z.ZodObject<
                      {
                        title: z.ZodOptional<z.ZodString>;
                        text: z.ZodOptional<z.ZodString>;
                        multiple: z.ZodOptional<z.ZodBoolean>;
                        options: z.ZodArray<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodString;
                              image: z.ZodOptional<z.ZodString>;
                            },
                            'strip',
                            z.ZodTypeAny,
                            {
                              id: string;
                              text: string;
                              image?: string | undefined;
                            },
                            {
                              id: string;
                              text: string;
                              image?: string | undefined;
                            }
                          >,
                          'many'
                        >;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        options: {
                          id: string;
                          text: string;
                          image?: string | undefined;
                        }[];
                        text?: string | undefined;
                        title?: string | undefined;
                        multiple?: boolean | undefined;
                      },
                      {
                        options: {
                          id: string;
                          text: string;
                          image?: string | undefined;
                        }[];
                        text?: string | undefined;
                        title?: string | undefined;
                        multiple?: boolean | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      options: {
                        id: string;
                        text: string;
                        image?: string | undefined;
                      }[];
                      text?: string | undefined;
                      title?: string | undefined;
                      multiple?: boolean | undefined;
                    };
                    type: 'keyboard';
                  },
                  {
                    data: {
                      options: {
                        id: string;
                        text: string;
                        image?: string | undefined;
                      }[];
                      text?: string | undefined;
                      title?: string | undefined;
                      multiple?: boolean | undefined;
                    };
                    type: 'keyboard';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'rate'>;
                    data: z.ZodObject<
                      {
                        value: z.ZodNumber;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        value: number;
                      },
                      {
                        value: number;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      value: number;
                    };
                    type: 'rate';
                  },
                  {
                    data: {
                      value: number;
                    };
                    type: 'rate';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'typing'>;
                    data: z.ZodObject<
                      {
                        text: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        text?: string | undefined;
                      },
                      {
                        text?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      text?: string | undefined;
                    };
                    type: 'typing';
                  },
                  {
                    data: {
                      text?: string | undefined;
                    };
                    type: 'typing';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'start'>;
                    data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {};
                    type: 'start';
                  },
                  {
                    data: {};
                    type: 'start';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'stop'>;
                    data: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {};
                    type: 'stop';
                  },
                  {
                    data: {};
                    type: 'stop';
                  }
                >,
                z.ZodObject<
                  {
                    type: z.ZodLiteral<'seen'>;
                    data: z.ZodObject<
                      {
                        messageId: z.ZodOptional<z.ZodString>;
                      },
                      'strip',
                      z.ZodTypeAny,
                      {
                        messageId?: string | undefined;
                      },
                      {
                        messageId?: string | undefined;
                      }
                    >;
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    data: {
                      messageId?: string | undefined;
                    };
                    type: 'seen';
                  },
                  {
                    data: {
                      messageId?: string | undefined;
                    };
                    type: 'seen';
                  }
                >,
              ]
            >;
            sender: z.ZodObject<
              {
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                phone: z.ZodOptional<z.ZodString>;
                avatar: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                id: string;
                name?: string | undefined;
                phone?: string | undefined;
                avatar?: string | undefined;
              },
              {
                id: string;
                name?: string | undefined;
                phone?: string | undefined;
                avatar?: string | undefined;
              }
            >;
            recipient: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  name: z.ZodOptional<z.ZodString>;
                  phone: z.ZodOptional<z.ZodString>;
                  avatar: z.ZodOptional<z.ZodString>;
                },
                'strip',
                z.ZodTypeAny,
                {
                  id: string;
                  name?: string | undefined;
                  phone?: string | undefined;
                  avatar?: string | undefined;
                },
                {
                  id: string;
                  name?: string | undefined;
                  phone?: string | undefined;
                  avatar?: string | undefined;
                }
              >
            >;
            occurredAt: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
          },
          'strip',
          z.ZodTypeAny,
          {
            tenantId: string;
            conversationId: string;
            direction: 'inbound' | 'outbound';
            source: 'jivo' | 'whatsapp' | 'system';
            payload:
              | {
                  data: {
                    text: string;
                  };
                  type: 'text';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'photo';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'video';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'audio';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'document';
                }
              | {
                  data: {
                    latitude: number;
                    longitude: number;
                    name?: string | undefined;
                    address?: string | undefined;
                  };
                  type: 'location';
                }
              | {
                  data: {
                    options: {
                      id: string;
                      text: string;
                      image?: string | undefined;
                    }[];
                    text?: string | undefined;
                    title?: string | undefined;
                    multiple?: boolean | undefined;
                  };
                  type: 'keyboard';
                }
              | {
                  data: {
                    value: number;
                  };
                  type: 'rate';
                }
              | {
                  data: {
                    text?: string | undefined;
                  };
                  type: 'typing';
                }
              | {
                  data: {};
                  type: 'start';
                }
              | {
                  data: {};
                  type: 'stop';
                }
              | {
                  data: {
                    messageId?: string | undefined;
                  };
                  type: 'seen';
                };
            sender: {
              id: string;
              name?: string | undefined;
              phone?: string | undefined;
              avatar?: string | undefined;
            };
            occurredAt: string;
            metadata?: Record<string, any> | undefined;
            correlationId?: string | undefined;
            recipient?:
              | {
                  id: string;
                  name?: string | undefined;
                  phone?: string | undefined;
                  avatar?: string | undefined;
                }
              | undefined;
          },
          {
            tenantId: string;
            conversationId: string;
            direction: 'inbound' | 'outbound';
            source: 'jivo' | 'whatsapp' | 'system';
            payload:
              | {
                  data: {
                    text: string;
                  };
                  type: 'text';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'photo';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'video';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'audio';
                }
              | {
                  data: {
                    url: string;
                    mimeType: string;
                    sizeBytes: number;
                    caption?: string | undefined;
                  };
                  type: 'document';
                }
              | {
                  data: {
                    latitude: number;
                    longitude: number;
                    name?: string | undefined;
                    address?: string | undefined;
                  };
                  type: 'location';
                }
              | {
                  data: {
                    options: {
                      id: string;
                      text: string;
                      image?: string | undefined;
                    }[];
                    text?: string | undefined;
                    title?: string | undefined;
                    multiple?: boolean | undefined;
                  };
                  type: 'keyboard';
                }
              | {
                  data: {
                    value: number;
                  };
                  type: 'rate';
                }
              | {
                  data: {
                    text?: string | undefined;
                  };
                  type: 'typing';
                }
              | {
                  data: {};
                  type: 'start';
                }
              | {
                  data: {};
                  type: 'stop';
                }
              | {
                  data: {
                    messageId?: string | undefined;
                  };
                  type: 'seen';
                };
            sender: {
              id: string;
              name?: string | undefined;
              phone?: string | undefined;
              avatar?: string | undefined;
            };
            occurredAt: string;
            metadata?: Record<string, any> | undefined;
            correlationId?: string | undefined;
            recipient?:
              | {
                  id: string;
                  name?: string | undefined;
                  phone?: string | undefined;
                  avatar?: string | undefined;
                }
              | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        id: string;
        createdAt: string;
        type: 'message';
        payload: {
          tenantId: string;
          conversationId: string;
          direction: 'inbound' | 'outbound';
          source: 'jivo' | 'whatsapp' | 'system';
          payload:
            | {
                data: {
                  text: string;
                };
                type: 'text';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'photo';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'video';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'audio';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'document';
              }
            | {
                data: {
                  latitude: number;
                  longitude: number;
                  name?: string | undefined;
                  address?: string | undefined;
                };
                type: 'location';
              }
            | {
                data: {
                  options: {
                    id: string;
                    text: string;
                    image?: string | undefined;
                  }[];
                  text?: string | undefined;
                  title?: string | undefined;
                  multiple?: boolean | undefined;
                };
                type: 'keyboard';
              }
            | {
                data: {
                  value: number;
                };
                type: 'rate';
              }
            | {
                data: {
                  text?: string | undefined;
                };
                type: 'typing';
              }
            | {
                data: {};
                type: 'start';
              }
            | {
                data: {};
                type: 'stop';
              }
            | {
                data: {
                  messageId?: string | undefined;
                };
                type: 'seen';
              };
          sender: {
            id: string;
            name?: string | undefined;
            phone?: string | undefined;
            avatar?: string | undefined;
          };
          occurredAt: string;
          metadata?: Record<string, any> | undefined;
          correlationId?: string | undefined;
          recipient?:
            | {
                id: string;
                name?: string | undefined;
                phone?: string | undefined;
                avatar?: string | undefined;
              }
            | undefined;
        };
      },
      {
        id: string;
        createdAt: string;
        type: 'message';
        payload: {
          tenantId: string;
          conversationId: string;
          direction: 'inbound' | 'outbound';
          source: 'jivo' | 'whatsapp' | 'system';
          payload:
            | {
                data: {
                  text: string;
                };
                type: 'text';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'photo';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'video';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'audio';
              }
            | {
                data: {
                  url: string;
                  mimeType: string;
                  sizeBytes: number;
                  caption?: string | undefined;
                };
                type: 'document';
              }
            | {
                data: {
                  latitude: number;
                  longitude: number;
                  name?: string | undefined;
                  address?: string | undefined;
                };
                type: 'location';
              }
            | {
                data: {
                  options: {
                    id: string;
                    text: string;
                    image?: string | undefined;
                  }[];
                  text?: string | undefined;
                  title?: string | undefined;
                  multiple?: boolean | undefined;
                };
                type: 'keyboard';
              }
            | {
                data: {
                  value: number;
                };
                type: 'rate';
              }
            | {
                data: {
                  text?: string | undefined;
                };
                type: 'typing';
              }
            | {
                data: {};
                type: 'start';
              }
            | {
                data: {};
                type: 'stop';
              }
            | {
                data: {
                  messageId?: string | undefined;
                };
                type: 'seen';
              };
          sender: {
            id: string;
            name?: string | undefined;
            phone?: string | undefined;
            avatar?: string | undefined;
          };
          occurredAt: string;
          metadata?: Record<string, any> | undefined;
          correlationId?: string | undefined;
          recipient?:
            | {
                id: string;
                name?: string | undefined;
                phone?: string | undefined;
                avatar?: string | undefined;
              }
            | undefined;
        };
      }
    >,
    z.ZodObject<
      {
        id: z.ZodString;
        type: z.ZodLiteral<'jivo-webhook'>;
        createdAt: z.ZodString;
        payload: z.ZodObject<
          {
            eventId: z.ZodString;
            tenantId: z.ZodString;
            jivoChannelId: z.ZodString;
            raw: z.ZodRecord<z.ZodString, z.ZodAny>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
          },
          'strip',
          z.ZodTypeAny,
          {
            tenantId: string;
            eventId: string;
            jivoChannelId: string;
            raw: Record<string, any>;
            headers?: Record<string, any> | undefined;
          },
          {
            tenantId: string;
            eventId: string;
            jivoChannelId: string;
            raw: Record<string, any>;
            headers?: Record<string, any> | undefined;
          }
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        id: string;
        createdAt: string;
        type: 'jivo-webhook';
        payload: {
          tenantId: string;
          eventId: string;
          jivoChannelId: string;
          raw: Record<string, any>;
          headers?: Record<string, any> | undefined;
        };
      },
      {
        id: string;
        createdAt: string;
        type: 'jivo-webhook';
        payload: {
          tenantId: string;
          eventId: string;
          jivoChannelId: string;
          raw: Record<string, any>;
          headers?: Record<string, any> | undefined;
        };
      }
    >,
  ]
>;
export type QueueEnvelope = z.infer<typeof queueEnvelopeSchema>;
export declare function assertMessageEnvelope(payload: unknown): MessageEnvelope;
export declare function assertQueueEnvelope(payload: unknown): QueueEnvelope;
