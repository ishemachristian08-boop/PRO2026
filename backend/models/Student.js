const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  grade: {
    type: String,
    enum: ['Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    required: true
  },
  class: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    address: {
      type: String,
      trim: true
    }
  },
  medicalInfo: {
    allergies: {
      type: String,
      trim: true
    },
    medications: {
      type: String,
      trim: true
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true
      },
      relationship: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      }
    }
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  academicRecords: [{
    subject: String,
    grade: String,
    term: String,
    year: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      default: 'Present'
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries (unique:true already creates index automatically)
studentSchema.index({ parent: 1 });
studentSchema.index({ grade: 1 });

// Static method to generate admission number
studentSchema.statics.generateAdmissionNumber = function(grade) {
  const year = new Date().getFullYear().toString().slice(-2);
  const gradeCode = grade === 'Nursery' ? 'N' : grade.replace('P', '');
  const randomNum = Math.floor(Math.random() * 9000 + 1000);
  return `NCA-${year}-${gradeCode}-${randomNum}`;
};

// Instance method to get full name
studentSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to get age
studentSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

module.exports = mongoose.model('Student', studentSchema);