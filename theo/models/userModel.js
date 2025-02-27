import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema ({
    imageUrl: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const scheduleSchema = new mongoose.Schema ({
    platform: {
        type: String,
        required: true,
    },
    postText: {
        type: String,
        required: false,
    },
    postDate: {
        type: Date,
        required: true,
    },
    postTime: {
        type: String,
        required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: false,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId, auto: true,
    }
});

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mySchedules: [scheduleSchema],
    myTemplates: [templateSchema],
    createAt: {
      type: Date,
      default: Date.now
    },
    ngo: {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      is_formalized: {
        type: Boolean,
        required: true
      },
      start_year: {
        type: Number
      },
      contact_phone: {
        type: String
      },
      instagram_link: {
        type: String
      },
      x_link: {
        type: String
      },
      facebook_link: {
        type: String
      },
      pix_qr_code_link: {
        type: String
      },
      gallery_images_url: {
        type: [String]
      },
      skills: [
        {
          id: {
            type: Number
          },
          name: {
            type: String
          }
        }
      ],
      causes: [
        {
          id: {
            type: Number
          },
          name: {
            type: String
          },
          description: {
            type: String
          }
        }
      ],
      sustainable_development_goals: [
        {
          id: {
            type: Number
          },
          name: {
            type: String
          },
          url_ods: {
            type: String
          },
          logo_url: {
            type: String
          }
        }
      ]
    },
    __v: {
      type: Number,
      default: 0
    }
  });

const UserModel = mongoose.model("User", userSchema);
const Template = mongoose.model("Template", templateSchema);
export { UserModel, Template };

