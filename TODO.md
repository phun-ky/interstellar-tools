
---

## Geodesy & distances

**Great-circle (sphere)**

- Central angle: \( \Delta\sigma=\arctan2\!\Big(\|\mathbf r_1\times\mathbf
  r_2\|,\ \mathbf r_1\cdot\mathbf r_2\Big) \)
- Haversine (lon/lat): \(
  h=\sin^2\!\frac{\Delta\varphi}{2}+\cos\varphi_1\cos\varphi_2\sin^2\!\frac{\Delta\lambda}{2}
  \) \( \Delta\sigma = 2\arcsin\sqrt{h},\quad d=R\,\Delta\sigma \)

**Radii of curvature (oblate)**

- \( M = \frac{a(1-e^2)}{(1-e^2\sin^2\varphi)^{3/2}} \), meridional
- \( N = \frac{a}{\sqrt{1-e^2\sin^2\varphi}} \), prime vertical

**Altitude above reference**

- Planetocentric radius \( r=\|\mathbf r\| \Rightarrow h \approx
  r-R(\varphi,\lambda) \)

---

## Map projections (common for global products)

**Equirectangular (simple cylindrical)**

- \( x = R(\lambda-\lambda_0)\cos\varphi_1,\quad y = R(\varphi-\varphi_0) \)

**Sinusoidal (equal-area)**

- \( x = R(\lambda-\lambda_0)\cos\varphi,\quad y = R\varphi \)

**Mollweide (equal-area)**

- Solve \( 2\theta+\sin 2\theta=\pi\sin\varphi \)
- \( x = \frac{2\sqrt{2}R}{\pi}(\lambda-\lambda_0)\cos\theta,\quad
  y=\sqrt{2}R\sin\theta \)

**Lambert azimuthal equal-area**

- \( k =
  \sqrt{\frac{2}{1+\sin\varphi_0\sin\varphi+\cos\varphi_0\cos\varphi\cos(\lambda-\lambda_0)}}
  \)
- \( x=Rk\cos\varphi\sin(\lambda-\lambda_0),\
  y=Rk\big(\cos\varphi_0\sin\varphi-\sin\varphi_0\cos\varphi\cos(\lambda-\lambda_0)\big) \)

**Stereographic (conformal, polar)**

- \(
  k=\frac{2R}{1+\sin\varphi_0\sin\varphi+\cos\varphi_0\cos\varphi\cos(\lambda-\lambda_0)}
  \)
- \( x=k\cos\varphi\sin(\lambda-\lambda_0),\
  y=k\big(\cos\varphi_0\sin\varphi-\sin\varphi_0\cos\varphi\cos(\lambda-\lambda_0)\big) \)

**Orthographic (globe view)**

- \( x=R\cos\varphi\sin(\lambda-\lambda_0),\quad
  y=R\big(\cos\varphi_0\sin\varphi-\sin\varphi_0\cos\varphi\cos(\lambda-\lambda_0)\big)
  \)

---

## Imaging geometry (for mapping pipelines)

**Ground Sample Distance (frame camera)**

- Pixel pitch \(p\), focal \(f\), altitude (slant) \(H\): \( \text{GSD} \approx
  \frac{H\,p}{f} \)

**Instantaneous FOV (pushbroom/scan)**

- \( \text{IFOV} \approx \frac{p}{f} \), swath \( \approx H \cdot \text{IFOV}
  \cdot N\_{\text{pixels}} \)

**Photometric/illumination angles**

- Incidence \(i\), emission \(e\), phase \(g\): \( \cos i = \hat{\mathbf
  n}\cdot\hat{\mathbf s},\ \cos e=\hat{\mathbf n}\cdot\hat{\mathbf o},\ \cos
  g=\hat{\mathbf s}\cdot\hat{\mathbf o} \)

**Simple reflectance models**

- Lambert: \( r \propto \cos i \)
- Lommel–Seeliger: \( r \propto \frac{\cos i}{\cos i+\cos e} \)

---

## DEM-derived terrain metrics

**Slope & aspect (from gradients)**

- Let \( z_x=\partial z/\partial x,\ z_y=\partial z/\partial y \) \(
  \text{slope}=\arctan\!\sqrt{z_x^2+z_y^2},\quad \text{aspect}=\arctan2(-z_y,
  -z_x) \)

**Hillshade (illumination from azimuth \(\psi\), elevation \(\alpha\))**

- \( \cos\theta_i = \sin\alpha\cos\text{slope} +
  \cos\alpha\sin\text{slope}\cos(\psi-\text{aspect}) \)
- Shade \( \propto \max(0,\cos\theta_i) \)

**Curvatures**

- Profile curvature \( k*p \) and planform curvature \( k*{pl} \) from second
  derivatives \( z*{xx},z*{yy},z\_{xy} \) (used for hazard & landing analysis)

---

## Tiling & indexing (web maps / slippy maps)

**Web-mercator tile coordinates (spherical)**

- \( x\_{\text{tile}} = \left\lfloor \frac{(\lambda+\pi)}{2\pi}\,2^z
  \right\rfloor \)
- \( y\_{\text{tile}} = \left\lfloor
  \frac{\big(1-\ln\big(\tan\frac{\varphi}{2}+\sec\varphi\big)/\pi\big)}{2}\,2^z
  \right\rfloor \)

**Quadkey**: interleave tile bits at zoom \(z\) to index tiles hierarchically.

---

## Grids & footprints

**Footprint area on sphere**

- Spherical polygon area via l’Huilier (excess \(E\)): \( A = R^2 E,\quad E=\sum
  \alpha_i - (n-2)\pi \)

**Buffer/visibility (simple horizon)**

- Horizon distance from height \(h\): \( d \approx \sqrt{2Rh+h^2} \)

---

## Error & uncertainty basics

**Linear error propagation**

- For \( y=f(\mathbf x) \): \( \sigma_y^2 \approx \nabla f^\top\,\mathbf
  C_x\,\nabla f \) Useful for GSD, geolocation, bundle-adjust outputs.

---

## Practical notes

- **Body conventions:** Many bodies use **planetocentric lat** & **east-positive
  lon**, but historical Mars/Moon products vary—always check IAU reports for the
  epoch.
- **Reference surfaces:** Choose sphere, ellipsoid, or shape model consistent
  with your mission (e.g., small bodies → triaxial or polyhedral).
- **Projection choice:** Equal-area for geology, conformal for
  navigation/feature-shape, azimuthal for polar caps.
- **Photometry:** Normalize imagery (incidence/emission/phase) before mosaicking
  to reduce seams.
- **Time/rotation:** Use the body’s \( W(t) \) model to transform inertial
  trajectories into **body-fixed** for mapping & targeting.

---

## Perturbations (common LEO/MEO approximations)

- **Thrust (vacuum, general form)**

  $$
  F=\dot{m}v_e+(p_e-p_a)A_e
  $$

- **Gravity loss (rule-of-thumb)**
  $$
  \Delta v_g \approx \int g\,\sin\gamma \, dt
  $$

## Entry, descent, landing (EDL)

- **Ballistic coefficient**

  $$
  \beta=\frac{m}{C_D A}
  $$

- **Peak convective heating (approx.)**
  $$
  \dot{q}\propto \frac{\sqrt{\rho}\,V^3}{\sqrt{R_n}}
  $$

## Attitude dynamics

- **Euler rotational dynamics**

  $$
  \mathbf{I}\,\dot{\boldsymbol{\omega}}+\boldsymbol{\omega}\times(\mathbf{I}\boldsymbol{\omega})=\mathbf{M}
  $$

- **Quaternion kinematics**
  $$
  \dot{\mathbf{q}}=\tfrac{1}{2}\,\Omega(\boldsymbol{\omega})\,\mathbf{q}
  $$

## Three-body & special tools

- **CR3BP Jacobi integral**

  $$
  C_J=2U-\|\dot{\mathbf{r}}\|^2
  $$

- **Tisserand parameter (w.r.t. planet with semimajor axis \(a_p\))**
  $$
  T=\frac{a_p}{a}+2\sqrt{\frac{a}{a_p}\,(1-e^2)}\cos i
  $$

---

### Quick picks

- **Mission sizing:** Tsiolkovsky, Hohmann \(\Delta v\), plane change
- **Orbit ops:** Vis-viva, Kepler’s eq., CW/Hill
- **Interplanetary:** \(C*3/v*\infty\), gravity-assist \(\delta\), SOI
- **LEO lifetime/groundtrack:** Drag \(a_D\), J2 precession

---
