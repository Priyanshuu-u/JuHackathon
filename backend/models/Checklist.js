import mongoose from 'mongoose';

const checklistSchema = new mongoose.Schema({
  patientDetails: {
    name: {
      type: String,
      
    },
    age: {
      type: Number,
      
    },
    medicalHistory: {
      type: String,
      
    },
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the team members (doctor, nurse, anaesthetist, etc.)
    
  }],
  sections: {
    induction: {
      patientIdentityConfirmed: {
        type: Boolean,
        default: false,
        
      },
      siteMarked: {
        type: Boolean,
        default: false,
        
      },
      anaesthesiaCheckComplete: {
        type: Boolean,
        default: false,
        
      },
      pulseOximeter: {
        type: Boolean,
        default: false,
        
      },
      knownAllergy: {
        type: String,
         // Yes/No
      },
      difficultAirwayRisk: {
        type: String,
         // Yes/No, and any additional info
      },
      riskOfBloodLoss: {
        type: String,
         // Yes/No, and any additional info
      },
    },
    skinIncision: {
      teamIntroduced: {
        type: String,
         // Yes/No
      },
      procedureConfirmed: {
        type: Boolean,
        default: false,
        
      },
      antibioticProphylaxisGiven: {
        type: Boolean,
        default: false,
        
      },
      criticalEvents: {
        surgeon: {
          type: String,
           // Critical or non-routine steps
        },
        anaesthetist: {
          type: String,
           // Patient-specific concerns
        },
        nursingTeam: {
          type: String,
           // Equipment or concerns
        },
      },
      sterilityConfirmed: {
        type: Boolean,
        default: false,
        
      },
      imagingDisplayed: {
        type: Boolean,
        default: false,
        
      },
    },
    postOp: {
      instrumentCountConfirmed: {
        type: Boolean,
        default: false,
        
      },
      specimenLabelConfirmed: {
        type: Boolean,
        default: false,
        
      },
      recoveryConcerns: {
        type: String,
         // Key concerns for recovery
      },
      equipmentProblems: {
        type: Boolean,
        default: false,
        
      },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
    
  },
});

export default mongoose.model('Checklist', checklistSchema);